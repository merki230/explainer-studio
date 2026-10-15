import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {theme} from '../theme';
import {BlobShadow, MuseumLights, MuseumSet, MuseumStage, PlasterBox} from '../three/MuseumStage';
import {OrangeLight} from '../three/OrangePath';
import {plaster, raw, roundedBox, roundedCylinder} from '../three/plaster';
import {CameraRig} from '../three/Stage';
import {WallPlate} from '../three/WallPlate';

type V3 = [number, number, number];

export type PhoneSceneProps = {
  durationInFrames: number;
  /** Orange "mic in use" light by the phone's front camera. */
  micDot?: boolean;
  /** Seconds into the scene when the mic light comes on (it flickers, then pulses slowly). */
  micAt?: number;
  /** Wall plate text. Omit for a bare wall. */
  plate?: {number: string; title: string};
};

// The phone, standing on a pedestal: a plaster sculpture of a phone.
const PHONE = {w: 0.62, h: 1.25, d: 0.07};
const PEDESTAL = {r: 0.42, h: 0.34};
const LEAN = -0.12; // leans back a little
const TURN = -0.22; // three-quarter view
/** Mic light position in the phone's local space (top right, beside the camera). */
const MIC_LOCAL: V3 = [0.12, PHONE.h / 2 - 0.075, PHONE.d / 2 + 0.01];

const seg = (x: number, a: number, b: number) =>
  interpolate(x, [a, b], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

/**
 * A phone as a museum exhibit: a plaster phone (no screen UI) standing on a
 * pedestal in the gallery. The only colour is the orange mic light.
 */
export const PhoneScene: React.FC<PhoneSceneProps> = ({durationInFrames, micDot = false, micAt = 0.6, plate}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;

  // Mic light: a short flicker (the tell), then a slow steady pulse.
  let mic = 0;
  if (micDot) {
    const flicker =
      (0.5 + 0.5 * Math.sin((t - micAt) * 16)) * seg(t, micAt, micAt + 0.15) * (1 - seg(t, micAt + 0.5, micAt + 0.6));
    const steady = seg(t, micAt + 0.55, micAt + 0.9) * (0.75 + 0.25 * Math.cos((t - micAt) * Math.PI * 1.2));
    mic = Math.max(flicker * 0.6, steady);
  }

  const micMat = React.useMemo(() => new THREE.MeshBasicMaterial({color: raw(theme.orange), transparent: true}), []);
  micMat.opacity = mic;

  const top = PEDESTAL.h;
  const phoneY = top + PHONE.h / 2 + 0.02;

  return (
    <MuseumStage post={{focusY: 0.42}}>
      <CameraRig
        from={[-0.15, 1.45, 4.6]}
        to={[0.05, 1.42, 4.15]}
        lookFrom={[0, 1.08, 0]}
        lookTo={[0, 1.1, 0]}
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

      {/* the phone: body, a recessed screen, the camera hole, the mic light */}
      <group position={[0, phoneY, 0]} rotation={[LEAN, TURN, 0]}>
        <mesh geometry={roundedBox(PHONE.w, PHONE.h, PHONE.d, 0.06, 5)} material={plaster()} castShadow receiveShadow />
        <PlasterBox
          size={[PHONE.w - 0.07, PHONE.h - 0.07, 0.01]}
          radius={0.004}
          position={[0, 0, PHONE.d / 2 - 0.002]}
          color={theme.plasterShade}
        />
        <PlasterBox
          size={[0.14, 0.04, 0.012]}
          radius={0.005}
          position={[0, PHONE.h / 2 - 0.075, PHONE.d / 2 + 0.004]}
        />
        <mesh position={MIC_LOCAL} material={micMat} userData={{glow: true}} visible={mic > 0.001}>
          <circleGeometry args={[0.018, 24]} />
        </mesh>
        <OrangeLight
          position={[MIC_LOCAL[0], MIC_LOCAL[1] + 0.02, MIC_LOCAL[2] + 0.15]}
          intensity={0.35 * mic}
          reach={0.7}
        />
      </group>
    </MuseumStage>
  );
};
