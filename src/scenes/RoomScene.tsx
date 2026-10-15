import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {LivingRoom, ROOM} from '../three/LivingRoom';
import {Mannequin, phoneWorld} from '../three/Mannequin';
import {MuseumLights, MuseumSet, MuseumStage} from '../three/MuseumStage';
import {OrangePath} from '../three/OrangePath';
import {CameraRig} from '../three/Stage';

type V3 = [number, number, number];

export type CameraMove = {from: V3; to: V3; lookFrom: V3; lookTo: V3; focusY: number};

const WIDE_END: Pick<CameraMove, 'to' | 'lookTo'> = {to: [0.15, 1.95, 5.75], lookTo: [0, 1.1, -0.1]};

/**
 * Camera presets. `push` starts exactly where `wide` ends, so `wide` → `push`
 * on consecutive scenes reads as one continuous move (the crossfade is invisible).
 */
export const ROOM_CAMERAS: Record<'wide' | 'push' | 'table', CameraMove> = {
  wide: {from: [-0.2, 2.0, 6.3], lookFrom: [0, 1.0, 0], ...WIDE_END, focusY: 0.45},
  // Ends looking at y 1.45 so the heads sit at y ≈ 900–1070 px, above the captions.
  push: {
    from: WIDE_END.to,
    lookFrom: WIDE_END.lookTo,
    to: [0.3, 1.95, 4.9],
    lookTo: [0.05, 1.45, -0.2],
    focusY: 0.5,
  },
  table: {from: [0.15, 1.8, 4.3], to: [0.05, 1.7, 3.9], lookFrom: [0, 1.0, -0.1], lookTo: [0, 0.98, -0.1], focusY: 0.5},
};

export type RoomSceneProps = {
  durationInFrames: number;
  /**
   * Camera move: 'wide' (whole exhibit), 'push' (people + router; starts where 'wide' ends),
   * 'table' (close on the two people and their phones), or a custom move.
   */
  camera?: keyof typeof ROOM_CAMERAS | CameraMove;
  /** Reveal the hidden network: orange route phone A → router → phone B. */
  arcs?: boolean;
  /** Seconds into the scene when the route starts drawing. */
  arcsAt?: number;
  /** Seconds the route takes to draw. */
  pathDuration?: number;
  /**
   * Seconds into the scene when phone A's screen flickers orange (the tell before
   * the reveal). Defaults to 1.5 s before `arcsAt` when `arcs` is on; negative
   * means it already happened (screen is lit from the start). Works without `arcs`.
   */
  tellAt?: number;
  /** Seconds the glow lasts after the route completes, then it fades to the matte stain. Omit to keep it glowing. */
  glowFor?: number;
  /** Start with the stains already there (route stain, wall wash, router LED): a later look at the same room. */
  stained?: boolean;
  /** Heads lean toward each other (eased in over 0.8 s from `facingAt`, so a cut from a non-facing shot stays clean). */
  facing?: boolean;
  /** Seconds into the scene when the heads start to turn. */
  facingAt?: number;
  /** Wall plate text, e.g. {number: 'No. 014', title: 'The Living Room'}. Omit for a bare wall. */
  plate?: {number: string; title: string};
};

const seg = (x: number, a: number, b: number) =>
  interpolate(x, [a, b], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

/** Two plaster figures on a couch in a museum exhibit; the network between their phones shows up in orange. */
export const RoomScene: React.FC<RoomSceneProps> = ({
  durationInFrames,
  camera = 'wide',
  arcs = false,
  arcsAt = 0.3,
  pathDuration = 1.8,
  tellAt,
  glowFor,
  stained = false,
  facing = false,
  facingAt = 0,
  plate,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const cam = typeof camera === 'string' ? (ROOM_CAMERAS[camera] ?? ROOM_CAMERAS.wide) : camera;
  const look = facing ? 0.5 * seg(t, facingAt, facingAt + 0.8) : 0;

  // The tell: phone A flickers, then holds steady orange.
  const tell = tellAt ?? (arcs ? arcsAt - 1.5 : undefined);
  let screenA = 0;
  if (tell !== undefined) {
    const flicker =
      (0.2 + 0.6 * (0.5 + 0.5 * Math.sin((t - tell) * 16))) *
      seg(t, tell, tell + 0.3) *
      (1 - seg(t, tell + 0.8, tell + 1.0));
    screenA = Math.max(flicker, seg(t, tell + 0.9, tell + 1.4));
  }

  // The reveal.
  const done = arcsAt + pathDuration;
  const p = arcs ? seg(t, arcsAt, done) : stained ? 1 : 0;
  const led = stained ? 1 : seg(p, 0.46, 0.54);
  const wash = stained ? 1 : seg(p, 0.5, 0.85);
  const screenB = arcs ? seg(p, 0.95, 1) : 0;
  const glow = !arcs ? 0 : glowFor === undefined ? 1 : 1 - seg(t, done + glowFor, done + glowFor + 0.8);
  const flow = arcs && p >= 1 ? (t - done) * 0.3 : undefined;

  const [seatA, seatB] = ROOM.seats;
  const a = phoneWorld(seatA);
  const b = phoneWorld(seatB);
  const r: V3 = [ROOM.router[0], ROOM.router[1] + 0.07, ROOM.router[2]];
  const legs: V3[][] = [
    [a, [a[0] - 0.15, 1.6, a[2] - 0.1], [-0.3, 2.25, -0.5], r],
    [r, [0.3, 2.25, -0.5], [b[0] + 0.15, 1.6, b[2] - 0.1], b],
  ];
  // The stain is the route's shadow on the wall: from just above the couch back
  // (the phone's light covers the rest) up and over to behind the router.
  const w = ROOM.wallZ + 0.004;
  const stainLegs: V3[][] = [
    [
      [a[0] - 0.15, 1.28, w],
      [a[0] - 0.1, 1.75, w],
      [-0.32, 2.15, w],
      [-0.12, 1.86, w],
    ],
    [
      [0.12, 1.86, w],
      [0.32, 2.15, w],
      [b[0] + 0.1, 1.75, w],
      [b[0] + 0.15, 1.28, w],
    ],
  ];

  return (
    <MuseumStage post={{focusY: cam.focusY}}>
      <CameraRig
        from={cam.from}
        to={cam.to}
        lookFrom={cam.lookFrom}
        lookTo={cam.lookTo}
        durationInFrames={durationInFrames}
      />
      {/* key aimed at the figures and wall rather than the table: an even wall, no hot table top */}
      <MuseumLights target={[0, 1.1, -0.5]} keyPosition={[1.3, 5.8, 4.6]} intensity={0.84} />
      <MuseumSet />
      <LivingRoom led={led} wash={wash} plate={plate} />
      <Mannequin position={seatA} phase={0} look={look} screen={screenA} />
      <Mannequin position={seatB} phase={2.1} look={-look} screen={screenB} />
      <OrangePath legs={legs} stainLegs={stainLegs} progress={p} glow={glow} flow={flow} />
    </MuseumStage>
  );
};
