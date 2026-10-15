import React, {useMemo} from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {theme} from '../theme';
import {BlobShadow, MuseumLights, MuseumSet, MuseumStage, PlasterBox} from '../three/MuseumStage';
import {OrangeLight, OrangePath} from '../three/OrangePath';
import {plaster, raw, roundedBox, roundedCylinder, scanTexture} from '../three/plaster';
import {CameraRig} from '../three/Stage';
import {WallPlate} from '../three/WallPlate';

type V3 = [number, number, number];

export type PhoneCameraMove = {from: V3; to: V3; lookFrom: V3; lookTo: V3; focusY: number};

const FRONT_END: Pick<PhoneCameraMove, 'to' | 'lookTo'> = {to: [0.05, 1.42, 4.15], lookTo: [0, 1.1, 0]};
const CLOSE_END: Pick<PhoneCameraMove, 'to' | 'lookTo'> = {to: [0.14, 1.43, 3.8], lookTo: [0, 1.11, 0]};

/**
 * Camera presets. Each one starts exactly where the previous one ends
 * (front → close → screen), so up to three phone shots back to back read as one
 * slow push and the crossfades between them are invisible.
 */
export const PHONE_CAMERAS: Record<'front' | 'close' | 'screen', PhoneCameraMove> = {
  front: {from: [-0.15, 1.45, 4.6], lookFrom: [0, 1.08, 0], ...FRONT_END, focusY: 0.42},
  close: {from: FRONT_END.to, lookFrom: FRONT_END.lookTo, ...CLOSE_END, focusY: 0.42},
  screen: {from: CLOSE_END.to, lookFrom: CLOSE_END.lookTo, to: [0.22, 1.45, 3.48], lookTo: [0, 1.13, 0], focusY: 0.42},
};

export type PhoneSceneProps = {
  durationInFrames: number;
  /**
   * Camera move: 'front' (the whole exhibit), 'close' (starts where 'front' ends),
   * 'screen' (starts where 'close' ends), or a custom move.
   */
  camera?: keyof typeof PHONE_CAMERAS | PhoneCameraMove;
  /** Orange "mic in use" light by the phone's front camera. */
  micDot?: boolean;
  /** Seconds into the scene when the mic light comes on (it flickers, then pulses slowly). */
  micAt?: number;
  /**
   * The screen is being recorded: an orange line traces the screen's edge, a scan
   * band sweeps the screen, and a route leaves the top of the phone and runs off-frame
   * (the recording is sent out). The edge glow fades to a matte stain frame.
   */
  screenRec?: boolean;
  /** Seconds into the scene when the recording starts (the edge starts tracing). Negative: already under way. */
  screenRecAt?: number;
  /** Start with the stain frame already on the screen and no live recording: a later look at the same phone. */
  screenStain?: boolean;
  /** Wall plate text. Omit for a bare wall. */
  plate?: {number: string; title: string};
};

// The phone, standing on a pedestal: a plaster sculpture of a phone.
const PHONE = {w: 0.62, h: 1.25, d: 0.07};
/** The screen: glass inset 35 mm from each edge, its face just proud of the body. */
const SCREEN = {w: PHONE.w - 0.07, h: PHONE.h - 0.07, z: PHONE.d / 2 + 0.003};
const PEDESTAL = {r: 0.42, h: 0.34};
const LEAN = -0.12; // leans back a little
const TURN = -0.22; // three-quarter view
const TOP_Y = PHONE.h / 2 - 0.075;
/** Mic light position in the phone's local space (top right, beside the earpiece). */
const MIC_LOCAL: V3 = [0.12, TOP_Y, PHONE.d / 2 + 0.01];
/** Front camera lens (top left, mirroring the mic light). */
const LENS_LOCAL: V3 = [-0.12, TOP_Y, SCREEN.z];

// Screen recording timing (seconds after `screenRecAt`).
const TRACE = 1.2; // the edge traces
const SEND = 0.8; // then the route leaves the top
const GLOW_HOLD = 1.0; // the edge glows this long after tracing, then fades to its stain (0.8 s)
const SCAN_PERIOD = 1.5;
const SCAN_H = 0.16;
/**
 * Core radius of the edge and outbound routes. OrangePath's 0.02 is sized for the
 * room seen from ≈ 6 units; the phone is seen from ≈ 3.5, so 0.012 reads the same.
 */
const EDGE_R = 0.012;

const seg = (x: number, a: number, b: number) =>
  interpolate(x, [a, b], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

/**
 * The screen's edge as one closed loop (a rounded rectangle, sampled evenly),
 * starting and ending at the top centre, clockwise as seen from the front.
 */
const edgeLoop = (hw: number, hh: number, r: number, z: number): V3[] => {
  const sx = hw - r;
  const sy = hh - r;
  // Perimeter pieces in order from the top centre: [length, point at distance d along it].
  const arc =
    (cx: number, cy: number, a0: number) =>
    (d: number): V3 => {
      const a = a0 - d / r;
      return [cx + Math.cos(a) * r, cy + Math.sin(a) * r, z];
    };
  const q = (Math.PI / 2) * r;
  const pieces: [number, (d: number) => V3][] = [
    [sx, (d) => [d, hh, z]],
    [q, arc(sx, sy, Math.PI / 2)],
    [2 * sy, (d) => [hw, sy - d, z]],
    [q, arc(sx, -sy, 0)],
    [2 * sx, (d) => [sx - d, -hh, z]],
    [q, arc(-sx, -sy, -Math.PI / 2)],
    [2 * sy, (d) => [-hw, -sy + d, z]],
    [q, arc(-sx, sy, Math.PI)],
    [sx, (d) => [-sx + d, hh, z]],
  ];
  const total = pieces.reduce((n, [l]) => n + l, 0);
  const N = 96;
  const pts: V3[] = [];
  for (let i = 0; i <= N; i++) {
    let d = (i / N) * total;
    for (const [l, at] of pieces) {
      if (d <= l + 1e-9) {
        pts.push(at(Math.min(d, l)));
        break;
      }
      d -= l;
    }
  }
  return pts;
};
const EDGE: V3[][] = [edgeLoop(SCREEN.w / 2, SCREEN.h / 2, 0.04, SCREEN.z + 0.022)];
const EDGE_STAIN: V3[][] = [edgeLoop(SCREEN.w / 2, SCREEN.h / 2, 0.04, SCREEN.z + 0.004)];

/**
 * A phone as a museum exhibit: a plaster phone (no screen UI) standing on a
 * pedestal in the gallery. The only colour is orange: the mic light, or the
 * screen being recorded and sent away.
 */
export const PhoneScene: React.FC<PhoneSceneProps> = ({
  durationInFrames,
  camera = 'front',
  micDot = false,
  micAt = 0.6,
  screenRec = false,
  screenRecAt = 0.3,
  screenStain = false,
  plate,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const cam = typeof camera === 'string' ? (PHONE_CAMERAS[camera] ?? PHONE_CAMERAS.front) : camera;

  // Mic light: a short flicker (the tell), then a slow steady pulse.
  let mic = 0;
  if (micDot) {
    const flicker =
      (0.5 + 0.5 * Math.sin((t - micAt) * 16)) * seg(t, micAt, micAt + 0.15) * (1 - seg(t, micAt + 0.5, micAt + 0.6));
    const steady = seg(t, micAt + 0.55, micAt + 0.9) * (0.75 + 0.25 * Math.cos((t - micAt) * Math.PI * 1.2));
    mic = Math.max(flicker * 0.6, steady);
  }

  // Screen recording: trace the edge → send → edge glow fades to a stain; the scan keeps sweeping.
  const r0 = screenRecAt;
  const edge = screenRec ? seg(t, r0, r0 + TRACE) : screenStain ? 1 : 0;
  const edgeGlow = screenRec ? 1 - seg(t, r0 + TRACE + GLOW_HOLD, r0 + TRACE + GLOW_HOLD + 0.8) : 0;
  const send = screenRec ? seg(t, r0 + TRACE, r0 + TRACE + SEND) : 0;
  const sendFlow = screenRec && send >= 1 ? (t - (r0 + TRACE + SEND)) * 0.45 : undefined;
  const live = screenRec ? seg(t, r0, r0 + 0.4) : 0;
  // The scan starts as the trace closes; each sweep fades in and out at the screen's ends.
  const scanT = t - (r0 + TRACE - 0.2);
  const scanPhase = (((scanT / SCAN_PERIOD) % 1) + 1) % 1;
  const scanOn = screenRec && scanT > 0 ? seg(scanT, 0, 0.3) : 0;
  const scan = scanOn * Math.min(1, scanPhase / 0.12, (1 - scanPhase) / 0.12);
  const scanY = SCREEN.h / 2 - SCAN_H / 2 - scanPhase * (SCREEN.h - SCAN_H);

  const mats = useMemo(
    () => ({
      mic: new THREE.MeshBasicMaterial({color: raw(theme.orange), transparent: true}),
      scan: new THREE.MeshBasicMaterial({map: scanTexture(), transparent: true, depthWrite: false, opacity: 0}),
    }),
    [],
  );
  mats.mic.opacity = mic;
  mats.scan.opacity = 0.65 * scan;

  const top = PEDESTAL.h;
  const phoneY = top + PHONE.h / 2 + 0.02;

  // The outbound route, in world space: it continues from the top of the traced edge,
  // over the phone's top edge, then up and right past the label, off the top of the frame.
  const send0 = useMemo(() => {
    const m = new THREE.Matrix4().compose(
      new THREE.Vector3(0, phoneY, 0),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(LEAN, TURN, 0)),
      new THREE.Vector3(1, 1, 1),
    );
    const w = (p: V3): V3 => {
      const v = new THREE.Vector3(...p).applyMatrix4(m);
      return [v.x, v.y, v.z];
    };
    return [w([0, SCREEN.h / 2, EDGE[0][0][2]]), w([0, PHONE.h / 2 + 0.06, PHONE.d / 2 + 0.02])];
  }, [phoneY]);
  const [s0, s1] = send0;
  const sendLegs: V3[][] = [
    [
      s0,
      s1,
      [s1[0] + 0.12, s1[1] + 0.1, s1[2] + 0.03],
      [0.47, s1[1] + 0.25, 0.12],
      [0.6, s1[1] + 0.7, 0.16],
      [0.62, s1[1] + 1.8, 0.2],
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
      <MuseumLights target={[0, 1.0, 0]} />
      <MuseumSet />
      {plate ? <WallPlate number={plate.number} title={plate.title} position={[-1.15, 0.98, -0.925]} /> : null}

      {/* pedestal */}
      <mesh
        geometry={roundedCylinder(PEDESTAL.r, PEDESTAL.h, 0.04)}
        material={plaster(theme.plasterShade, 0.95)}
        position={[0, PEDESTAL.h / 2, 0]}
        castShadow
        receiveShadow
      />
      <BlobShadow position={[0, 0.004, 0]} size={[1.3, 1.3]} opacity={0.44} />

      {/* the phone: body, glass, earpiece, lens, side button, home bar, mic light */}
      <group position={[0, phoneY, 0]} rotation={[LEAN, TURN, 0]}>
        <mesh geometry={roundedBox(PHONE.w, PHONE.h, PHONE.d, 0.06, 5)} material={plaster()} castShadow receiveShadow />
        {/* screen glass: a step brighter and a little smoother than the body */}
        <mesh
          geometry={roundedBox(SCREEN.w, SCREEN.h, 0.01, 0.004)}
          material={plaster(theme.plasterGlass, 0.7)}
          position={[0, 0, SCREEN.z - 0.005]}
          receiveShadow
        />
        {/* earpiece (no shadow: on the glass it drew a hard outline) */}
        <mesh
          geometry={roundedBox(0.14, 0.035, 0.008, 0.004)}
          material={plaster(theme.plasterShade)}
          position={[0, TOP_Y, SCREEN.z + 0.002]}
          receiveShadow
        />
        {/* front camera: a recessed ring with a darker lens */}
        <mesh
          geometry={roundedCylinder(0.022, 0.008, 0.003, 24)}
          material={plaster(theme.plasterShade, 0.95)}
          position={LENS_LOCAL}
          rotation={[Math.PI / 2, 0, 0]}
        />
        <mesh
          geometry={roundedCylinder(0.012, 0.01, 0.003, 24)}
          material={plaster(theme.plasterFloor, 0.6)}
          position={[LENS_LOCAL[0], LENS_LOCAL[1], LENS_LOCAL[2] + 0.002]}
          rotation={[Math.PI / 2, 0, 0]}
        />
        {/* side button (the side that faces the camera) */}
        <PlasterBox size={[0.016, 0.17, 0.026]} radius={0.006} position={[PHONE.w / 2 + 0.002, 0.26, 0]} />
        {/* home bar */}
        <PlasterBox
          size={[0.17, 0.014, 0.006]}
          radius={0.0025}
          position={[0, -SCREEN.h / 2 + 0.045, SCREEN.z + 0.002]}
          color={theme.plasterShade}
        />
        <mesh position={MIC_LOCAL} material={mats.mic} userData={{glow: true}} visible={mic > 0.001}>
          <circleGeometry args={[0.018, 24]} />
        </mesh>
        <OrangeLight
          position={[MIC_LOCAL[0], MIC_LOCAL[1] + 0.02, MIC_LOCAL[2] + 0.15]}
          intensity={0.35 * mic}
          reach={0.7}
        />

        {/* screen recording: the traced edge (glow, then its stain), the scan band, the bleed */}
        {edge > 0 ? (
          <OrangePath
            legs={EDGE}
            stainLegs={EDGE_STAIN}
            progress={edge}
            glow={edgeGlow}
            radius={EDGE_R}
            stainRadius={0.007}
            runner={false}
          />
        ) : null}
        <mesh
          position={[0, scanY, SCREEN.z + 0.002]}
          material={mats.scan}
          userData={{glow: true}}
          visible={scan > 0.001}
          renderOrder={2}
        >
          <planeGeometry args={[SCREEN.w - 0.03, SCAN_H]} />
        </mesh>
        <OrangeLight position={[0, 0.1, SCREEN.z + 0.45]} intensity={0.3 * live} reach={1.4} />
      </group>
      {screenRec ? (
        <OrangePath legs={sendLegs} progress={send} stain={false} flow={sendFlow} dots={3} radius={EDGE_R} />
      ) : null}
    </MuseumStage>
  );
};
