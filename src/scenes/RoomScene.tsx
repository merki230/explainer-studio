import React, {useMemo} from 'react';
import * as THREE from 'three';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {LivingRoom, ROOM} from '../three/LivingRoom';
import {Mannequin, phoneWorld} from '../three/Mannequin';
import {MuseumLights, MuseumSet, MuseumStage} from '../three/MuseumStage';
import {OrangePath} from '../three/OrangePath';
import {CameraRig} from '../three/Stage';
import {HEIGHT, SAFE, WIDTH} from '../theme';

type V3 = [number, number, number];

export type CameraMove = {from: V3; to: V3; lookFrom: V3; lookTo: V3; focusY: number};

const WIDE_END: Pick<CameraMove, 'to' | 'lookTo'> = {to: [0.15, 1.95, 5.75], lookTo: [0, 1.1, -0.1]};

/**
 * Camera presets. `push` starts exactly where `wide` ends, so `wide` → `push`
 * on consecutive scenes reads as one continuous move (the crossfade is invisible).
 */
export const ROOM_CAMERAS: Record<'wide' | 'push' | 'table' | 'devices', CameraMove> = {
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
  // Low and further back: both phones, the laptop on the table and the router all
  // between the label and the captions (router below the label, laptop above the captions).
  devices: {
    from: [-0.05, 1.18, 7.7],
    to: [0.1, 1.15, 7.4],
    lookFrom: [0.05, 0.7, 0],
    lookTo: [0.08, 0.68, 0],
    focusY: 0.45,
  },
};

export type RoomSceneProps = {
  durationInFrames: number;
  /**
   * Camera move: 'wide' (whole exhibit), 'push' (people + router; starts where 'wide' ends),
   * 'table' (close on the two people and their phones), 'devices' (low and wide: both phones,
   * the laptop and the router clear of the label and captions), or a custom move.
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
  /**
   * Seconds into the scene when each device lights up, in order [phone B ("you"), the laptop, phone A
   * (the friend)]: a short flicker, then it holds. When set, it drives all three screens (it overrides
   * `tellAt` and the reveal's screen). Negative: already lit.
   */
  devicesAt?: [number, number, number];
  /** Seconds into the scene when the router LED and the wall wash brighten ("One home"). */
  householdAt?: number;
  /** Wall plate text, e.g. {number: 'No. 014', title: 'The Living Room'}. Omit for a bare wall. */
  plate?: {number: string; title: string};
  /**
   * Where the plate hangs [x, y] on the wall. Default: the first spot in ROOM.plateSpots that
   * stays inside x 120–888 and clear of the label for this camera move (close moves get the upper-left spot).
   */
  plateAt?: [number, number];
};

/**
 * Where the wall plate goes for a camera move: the first of ROOM.plateSpots that stays
 * inside the platform safe zone (x 120–888) and clear of the exhibit label at both ends
 * of the move; failing that, the first that does where the move comes to rest; else the last.
 */
const pickPlateSpot = (cam: CameraMove): [number, number] => {
  const c = new THREE.PerspectiveCamera(40, WIDTH / HEIGHT, 0.1, 60);
  const fitsFrom =
    (pos: V3, look: V3) =>
    ([x, y]: [number, number]) => {
      c.position.set(...pos);
      c.lookAt(...look);
      c.updateMatrixWorld();
      const [w, h] = ROOM.plateSize;
      const px = [-1, 1].flatMap((sx) =>
        [-1, 1].map((sy) => {
          const v = new THREE.Vector3(x + (sx * w) / 2, y + (sy * h) / 2, ROOM.wallZ).project(c);
          return [((v.x + 1) / 2) * WIDTH, ((1 - v.y) / 2) * HEIGHT];
        }),
      );
      const left = Math.min(...px.map((p) => p[0]));
      const right = Math.max(...px.map((p) => p[0]));
      const top = Math.min(...px.map((p) => p[1]));
      const bottom = Math.max(...px.map((p) => p[1]));
      // the label card: x ≈ 270–810, y 340–445, plus a 16 px gap
      const underLabel = right > 270 && left < 810 && top < 461 && bottom > 324;
      return left >= SAFE.left && right <= SAFE.right && !underLabel;
    };
  const atStart = fitsFrom(cam.from, cam.lookFrom);
  const atEnd = fitsFrom(cam.to, cam.lookTo);
  const spots = ROOM.plateSpots;
  return spots.find((s) => atStart(s) && atEnd(s)) ?? spots.find(atEnd) ?? spots[spots.length - 1];
};

const seg = (x: number, a: number, b: number) =>
  interpolate(x, [a, b], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

/** A device coming on: a short flicker (≈ 0.5 s), then a 0.3 s ramp to full, held. */
const deviceOn = (t: number, at: number) => {
  const flicker =
    (0.2 + 0.6 * (0.5 + 0.5 * Math.sin((t - at) * 16))) * seg(t, at, at + 0.15) * (1 - seg(t, at + 0.45, at + 0.6));
  return Math.max(flicker, seg(t, at + 0.45, at + 0.75));
};

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
  devicesAt,
  householdAt,
  plate,
  plateAt,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const cam = typeof camera === 'string' ? (ROOM_CAMERAS[camera] ?? ROOM_CAMERAS.wide) : camera;
  const look = facing ? 0.5 * seg(t, facingAt, facingAt + 0.8) : 0;
  const camKey = JSON.stringify(cam);
  const plateSpot = useMemo(() => pickPlateSpot(JSON.parse(camKey)), [camKey]);

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
  let screenB = arcs ? seg(p, 0.95, 1) : 0;
  const glow = !arcs ? 0 : glowFor === undefined ? 1 : 1 - seg(t, done + glowFor, done + glowFor + 0.8);
  const flow = arcs && p >= 1 ? (t - done) * 0.3 : undefined;

  // Per-device lights (phone B, laptop, phone A) override the screens above.
  let laptop = 0;
  if (devicesAt) {
    screenB = deviceOn(t, devicesAt[0]);
    laptop = deviceOn(t, devicesAt[1]);
    screenA = deviceOn(t, devicesAt[2]);
  }
  const household = householdAt === undefined ? 0 : seg(t, householdAt, householdAt + 0.5);

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
      <LivingRoom
        led={led}
        wash={wash}
        household={household}
        laptop={laptop}
        plate={plate}
        plateAt={plateAt ?? plateSpot}
      />
      <Mannequin position={seatA} phase={0} look={look} screen={screenA} />
      <Mannequin position={seatB} phase={2.1} look={-look} screen={screenB} />
      <OrangePath legs={legs} stainLegs={stainLegs} progress={p} glow={glow} flow={flow} />
    </MuseumStage>
  );
};
