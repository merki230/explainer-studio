import {useThree} from '@react-three/fiber';
import React, {useMemo} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {REAL} from '../theme';
import {raw} from '../three/plaster';
import {SNAP_BADGE, SNAP_SIZE, SNAP_VARIANTS, SNAP_VIEWS, type SnapVariant, type SnapView} from '../three/real/cameraSnapshot';
import {carToWorld, DrivingCar} from '../three/real/DrivingCar';
import {CitySlice} from '../three/section/CitySlice';
import {SectionLights, SectionStage} from '../three/section/SectionStage';

type V3 = [number, number, number];

/*
 * Helper still composition `zz-camera-snapshot` (No. 015; registered in `src/Root.tsx`): frame n renders
 * `SNAP_VARIANTS[n]`, the plate camera's view of one car stopped at the red on the city slice (Day), with the same car,
 * paint, roof rack, plate and lamps as the video. Never in a video; render it to PNGs with
 *   yarn remotion render zz-camera-snapshot out/flock-camera/raw/snapshots --sequence --image-format=png
 * and copy them to `src/videos/<slug>/snapshots/<variant name>.png` (the camera-view box reads them from there).
 */

/** Where the car stands (world): lane 3 at the red, as in `flock-camera` (heading −z, yaw 0). */
const CAR_AT = {x: 8.25, z: -32, yaw: 0};
const w = (p: V3) => carToWorld(p, CAR_AT);

/** The R3F camera set to a snapshot view (car-local → world), every render (no useFrame). */
const SnapCamera: React.FC<{view: SnapView}> = ({view}) => {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  camera.position.set(...w(view.position));
  camera.lookAt(new THREE.Vector3(...w(view.look)));
  camera.fov = view.fov;
  camera.aspect = SNAP_SIZE.width / SNAP_SIZE.height;
  camera.near = 0.1;
  camera.far = 600;
  camera.updateProjectionMatrix();
  return null;
};

/** The blank make badge (F2): a chrome oval with a darker blank face, flush on the tailgate (car-local). */
const Badge: React.FC = () => {
  const mats = useMemo(
    () => ({
      rim: new THREE.MeshStandardMaterial({color: raw(REAL.chrome), roughness: 0.25, metalness: 0.9}),
      face: new THREE.MeshStandardMaterial({color: raw(REAL.dash), roughness: 0.5, metalness: 0.2}),
    }),
    [],
  );
  const b = SNAP_BADGE;
  return (
    <group position={[b.x, b.y, 0]} rotation={[0, 0, Math.PI / 2]}>
      <mesh material={mats.rim} scale={[b.halfH, 0.012, b.halfW]}>
        <cylinderGeometry args={[1, 1, 1, 40]} />
      </mesh>
      <mesh material={mats.face} position={[0, 0.003, 0]} scale={[b.halfH * 0.62, 0.012, b.halfW * 0.74]}>
        <cylinderGeometry args={[1, 1, 1, 40]} />
      </mesh>
    </group>
  );
};

const SnapCar: React.FC<{v: SnapVariant}> = ({v}) => (
  <group>
    <DrivingCar
      mood="day"
      at={CAR_AT}
      travelled={0}
      blur={0}
      body={v.driver === 'you' ? 'you' : 'extra'}
      paint={v.paint}
      shape={v.shape}
      tail={0}
      brake={v.brake ? 1 : 0}
      plate={v.plate}
      plateBright={v.ir ? 1 : 0}
      driver={v.driver}
      clockOffset={0}
      roofRack={v.rack}
    />
    {v.badge ? (
      <group position={[CAR_AT.x, 0, CAR_AT.z]} rotation={[0, Math.PI / 2 - CAR_AT.yaw, 0]}>
        <Badge />
      </group>
    ) : null}
  </group>
);

/** One snapshot per frame (`SNAP_VARIANTS`), `SNAP_SIZE`. */
export const CameraSnapshotStill: React.FC = () => {
  const frame = useCurrentFrame();
  const v = SNAP_VARIANTS[Math.min(frame, SNAP_VARIANTS.length - 1)];
  const view = SNAP_VIEWS[v.view];
  return (
    <AbsoluteFill>
      <SectionStage mood="day" fov={view.fov} post={{vignette: 0, grain: 0, softFocus: 0}} ao far={600}>
        <SnapCamera view={view} />
        <SectionLights mood="day" target={w([-0.5, 0, 0])} lamp={0} extent={9} figureSpot={false} />
        <CitySlice mood="day" stopLine={35} signal="red" ink={1} signs={[]} trees />
        <SnapCar v={v} />
      </SectionStage>
    </AbsoluteFill>
  );
};

export const CAMERA_SNAPSHOT_COMPOSITION = {
  id: 'zz-camera-snapshot',
  width: SNAP_SIZE.width,
  height: SNAP_SIZE.height,
  durationInFrames: SNAP_VARIANTS.length,
};
