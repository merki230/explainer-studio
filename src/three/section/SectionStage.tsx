import {ThreeCanvas} from '@remotion/three';
import React, {useMemo} from 'react';
import {useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {MOODS, type Mood} from '../../theme';
import {MuseumPost, type PostSettings} from '../MuseumPost';
import {raw} from '../plaster';

type V3 = [number, number, number];

/**
 * Full-frame canvas for a Section slice (style guide v0.8 § 2): the mood's `bg` behind
 * everything, no fog (the slice floats like a section drawing), soft PCF shadows, fov 26°,
 * and the shared post pass (selective bloom, light soft focus, vignette, grain).
 */
export const SectionStage: React.FC<{
  mood: Mood;
  children: React.ReactNode;
  fov?: number;
  post?: Partial<PostSettings>;
}> = ({mood, children, fov = 26, post}) => {
  const {width, height} = useVideoConfig();
  const m = MOODS[mood];
  const bg = useMemo(() => raw(m.bg), [m.bg]);
  return (
    <ThreeCanvas
      width={width}
      height={height}
      shadows="percentage"
      gl={{antialias: false}}
      camera={{fov, near: 0.1, far: 80, position: [4.6, 3.6, 8.6]}}
      style={{backgroundColor: m.bg}}
    >
      <primitive attach="background" object={bg} />
      {children}
      <MuseumPost vignette={m.vignette} softFocus={0.35} exposure={m.exposure} shoulder={m.shoulder} {...post} />
    </ThreeCanvas>
  );
};

/**
 * The mood's lights (§ 4): hemisphere, one shadow-casting directional key, a fill, and in Night
 * the floor lamp's light. Intensities are the mock-up's × π (three's physical light units).
 */
export const SectionLights: React.FC<{
  mood: Mood;
  /** Where the key points. */
  target?: V3;
  /** Lamp level multiplier (Night): 1 = as specified; the scene breathes it ±3%. */
  lamp?: number;
  /** World position of the lamp's light. */
  lampAt?: V3;
}> = ({mood, target = [0, 0.6, -0.2], lamp = 1, lampAt = [-1.45, 1.3, -0.75]}) => {
  const m = MOODS[mood];
  const lights = useMemo(() => {
    const hemi = new THREE.HemisphereLight(raw(m.hemi[0]), raw(m.hemi[1]), m.hemi[2] * Math.PI);
    const key = new THREE.DirectionalLight(raw(m.key.color), m.key.intensity * Math.PI);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    Object.assign(key.shadow.camera, {left: -3, right: 3, top: 3, bottom: -3, near: 0.5, far: 14});
    key.shadow.radius = 4;
    key.shadow.bias = -0.0006;
    key.shadow.normalBias = 0.01;
    const fill = new THREE.DirectionalLight(raw(m.fill.color), m.fill.intensity * Math.PI);
    // Day bounce: low, from the right front, so it lifts the walls (the left one most) more than the tops; no shadows
    const bounce = new THREE.DirectionalLight(raw(m.bounce?.color ?? '#000000'), (m.bounce?.intensity ?? 0) * Math.PI);
    return {hemi, key, fill, bounce};
  }, [m]);
  lights.key.position.set(...m.key.position);
  lights.key.target.position.set(...target);
  lights.key.target.updateMatrixWorld();
  lights.fill.position.set(...m.fill.position);
  lights.bounce.position.set(...(m.bounce?.position ?? [0, 1, 1]));
  return (
    <>
      <primitive object={lights.hemi} />
      <primitive object={lights.key} />
      <primitive object={lights.key.target} />
      <primitive object={lights.fill} />
      <primitive object={lights.bounce} />
      {/*
        Always mounted (0 in Day): changing the number of lights recompiles every shader.
        Linear falloff (decay 1) and × 0.9: the mock-up's legacy point light had no inverse-square
        law, and at 2 it burned a white disc into the wall behind the shade.
      */}
      <pointLight
        position={lampAt}
        color={raw(m.lamp?.light ?? '#000000')}
        intensity={m.lamp ? m.lamp.intensity * 0.9 * lamp : 0}
        distance={m.lamp?.reach ?? 4}
        decay={1}
      />
    </>
  );
};
