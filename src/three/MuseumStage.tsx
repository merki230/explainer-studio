import {ThreeCanvas} from '@remotion/three';
import React, {useMemo} from 'react';
import {useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {theme} from '../theme';
import {MuseumPost, type PostSettings} from './MuseumPost';
import {blobTexture, plaster, raw, roundedBox} from './plaster';

type V3 = [number, number, number];

/** A plaster mesh with rounded edges that casts and receives soft shadows. */
export const PlasterBox: React.FC<{
  size: V3;
  /** Edge radius. */
  radius?: number;
  position?: V3;
  rotation?: V3;
  color?: string;
  /** Bevel smoothness (see roundedBox). */
  segments?: number;
}> = ({size, radius = 0.04, position, rotation, color, segments}) => (
  <mesh
    geometry={roundedBox(size[0], size[1], size[2], radius, segments)}
    material={plaster(color)}
    position={position}
    rotation={rotation}
    castShadow
    receiveShadow
  />
);

/** Soft contact shadow on the ground: a cheap stand-in for ambient occlusion. */
export const BlobShadow: React.FC<{position: V3; size: [number, number]; opacity?: number}> = ({
  position,
  size,
  opacity = 0.55,
}) => {
  const material = useMemo(
    () => new THREE.MeshBasicMaterial({map: blobTexture(), transparent: true, depthWrite: false, opacity}),
    [opacity],
  );
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} material={material} renderOrder={1}>
      <planeGeometry args={size} />
    </mesh>
  );
};

/**
 * Gallery lighting: soft skylight, one warm spot key with soft shadows, a cool
 * fill and a back rim. Intensities are the mock-up's, scaled by π for three's
 * physical light units.
 */
export const MuseumLights: React.FC<{
  /** Where the key spot points (the subject). */
  target?: V3;
  keyPosition?: V3;
  /** Multiplier on all lights. Whites should sit at 85–90%, never clip. */
  intensity?: number;
}> = ({target = [0, 0.7, -0.1], keyPosition = [1.5, 7, 3.5], intensity = 0.9}) => {
  const lights = useMemo(() => {
    const k = intensity * Math.PI;
    // Skylight 0.42 (guide: 0.34): the wide shot read muddy at the top and sides.
    const hemi = new THREE.HemisphereLight(raw('#fff9f1'), raw('#cbc2b4'), 0.42 * k);
    // Penumbra here is the cone's light falloff, not shadow softness: keep 0.75
    // (0.95 dims everything off-axis). Soft shadow edges come from shadow.radius.
    const key = new THREE.SpotLight(raw('#fff3e3'), 1.0 * k, 0, 0.5, 0.75, 0);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    // Soft edges, and no shadow acne (hatching) on curved plaster.
    key.shadow.radius = 9;
    key.shadow.bias = -0.0008;
    key.shadow.normalBias = 0.02;
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 20;
    const fill = new THREE.DirectionalLight(raw('#dfe6f2'), 0.15 * k);
    fill.position.set(-4, 3, 4);
    const rim = new THREE.DirectionalLight(raw('#ffffff'), 0.2 * k);
    rim.position.set(0, 4, -5);
    return {hemi, key, fill, rim};
  }, [intensity]);
  lights.key.position.set(...keyPosition);
  lights.key.target.position.set(...target);
  lights.key.target.updateMatrixWorld();
  return (
    <>
      <primitive object={lights.hemi} />
      <primitive object={lights.key} />
      <primitive object={lights.key.target} />
      <primitive object={lights.fill} />
      <primitive object={lights.rim} />
    </>
  );
};

/** The exhibit set: a plinth the scene stands on, the gallery floor, and a wall slab behind. */
export const MuseumSet: React.FC<{
  /** Plinth footprint [width, depth]; its top is at y = 0. Null hides it (things stand on the floor, y = -0.5). */
  plinth?: [number, number] | null;
  plinthZ?: number;
  /** Wall slab [width, height] standing at the back of the plinth. Null hides it. */
  wall?: [number, number] | null;
  wallZ?: number;
}> = ({plinth = [3.8, 3.2], plinthZ = 0.15, wall = [3.8, 3.3], wallZ = -0.99}) => {
  const floor = useMemo(() => new THREE.MeshStandardMaterial({color: raw(theme.plasterFloor), roughness: 1}), []);
  return (
    <group>
      {plinth ? (
        <PlasterBox
          size={[plinth[0], 0.5, plinth[1]]}
          radius={0.05}
          position={[0, -0.25, plinthZ]}
          color={theme.plasterShade}
        />
      ) : null}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} material={floor} receiveShadow>
        <planeGeometry args={[60, 60]} />
      </mesh>
      {wall ? <PlasterBox size={[wall[0], wall[1], 0.12]} position={[0, wall[1] / 2 - 0.05, wallZ]} /> : null}
    </group>
  );
};

export type MuseumStageProps = {
  children: React.ReactNode;
  fov?: number;
  /** Background and fog colour. */
  background?: string;
  /** Fog [near, far] in world units. */
  fog?: [number, number];
  /** Post-processing overrides (bloom, vignette, grain, soft focus, exposure). */
  post?: Partial<PostSettings>;
};

/**
 * Full-frame canvas in the Plaster Museum look: background + fog, soft PCF
 * shadows, and the museum post pass. Add <MuseumLights/>, <MuseumSet/> and a
 * <CameraRig/> inside (kept separate so scenes can move them).
 */
export const MuseumStage: React.FC<MuseumStageProps> = ({
  children,
  fov = 40,
  background = theme.museum,
  fog = [9, 18],
  post,
}) => {
  const {width, height} = useVideoConfig();
  const bg = useMemo(() => raw(background), [background]);
  const [fogNear, fogFar] = fog;
  const fogObj = useMemo(() => new THREE.Fog(raw(background), fogNear, fogFar), [background, fogNear, fogFar]);
  // Fog's constructor converts its colour; force the raw value back.
  fogObj.color.copy(bg);
  return (
    <ThreeCanvas
      width={width}
      height={height}
      shadows="percentage"
      gl={{antialias: false}}
      camera={{fov, near: 0.1, far: 60, position: [0, 2, 6.2]}}
      style={{backgroundColor: background}}
    >
      <primitive attach="background" object={bg} />
      <primitive attach="fog" object={fogObj} />
      {children}
      <MuseumPost {...post} />
    </ThreeCanvas>
  );
};
