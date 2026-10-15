import React, {useMemo} from 'react';
import {Easing, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {theme} from '../theme';
import {Bust} from '../three/Mannequin';
import {BlobShadow, MuseumLights, MuseumSet, MuseumStage} from '../three/MuseumStage';
import {OrangeLight, OrangePath} from '../three/OrangePath';
import {raw} from '../three/plaster';
import {CameraRig} from '../three/Stage';
import {WallPlate} from '../three/WallPlate';

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
};

const seg = (x: number, a: number, b: number) =>
  interpolate(x, [a, b], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

const PEDESTAL = 0.8;
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
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;

  const done = linkAt + linkDuration;
  const p = seg(t, linkAt, done);
  const glow = glowFor === undefined ? 1 : 1 - seg(t, done + glowFor, done + glowFor + 0.8);
  const flow = p >= 1 ? (t - done) * 0.3 : undefined;

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

  return (
    <MuseumStage post={{focusY: 0.42}}>
      <CameraRig
        from={[-0.1, 1.75, 6.2]}
        to={[0.1, 1.7, 5.75]}
        lookFrom={[0, 1.32, 0]}
        lookTo={[0, 1.32, -0.05]}
        durationInFrames={durationInFrames}
      />
      <MuseumLights target={[0, 1.2, 0]} />
      <MuseumSet />
      {plate ? <WallPlate number={plate.number} title={plate.title} position={[-1.15, 0.98, -0.925]} /> : null}
      <Bust position={[-spread, 0, 0]} pedestal={PEDESTAL} scale={SCALE} turn={0.45} />
      <Bust position={[spread, 0, 0]} pedestal={PEDESTAL} scale={SCALE} turn={-0.45} />
      <BlobShadow position={[-spread, 0.004, 0]} size={[1.0, 1.0]} opacity={0.44} />
      <BlobShadow position={[spread, 0.004, 0]} size={[1.0, 1.0]} opacity={0.44} />

      <OrangePath legs={legs} stainLegs={stainLegs} progress={p} glow={glow} flow={flow} radius={0.022} />
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
