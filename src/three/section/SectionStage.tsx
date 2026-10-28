import {ThreeCanvas} from '@remotion/three';
import React, {useMemo} from 'react';
import {useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {MOODS, type Mood} from '../../theme';
import {MuseumPost, type PostSettings} from '../MuseumPost';
import {raw} from '../plaster';
import {MoodLook} from '../real/useStudioEnv';
import type {MoodPalette} from './moods';

type V3 = [number, number, number];

/**
 * Full-frame canvas for a Section slice (style guide v0.8 § 2): the mood's `bg` behind
 * everything, no fog (the slice floats like a section drawing), soft PCF shadows, fov 26°,
 * and the shared post pass (selective bloom, light soft focus, vignette, grain).
 */
export const SectionStage: React.FC<{
  mood: Mood;
  /** A blended palette (the time-passes beat); default the mood's own. */
  palette?: MoodPalette;
  children: React.ReactNode;
  fov?: number;
  post?: Partial<PostSettings>;
  /** Screen-space ambient occlusion at the mood's strength (`MOODS.ao`; realism pass). Default off. */
  ao?: boolean;
  /** Far clipping plane (default 80); a whole building framed from far back needs more. */
  far?: number;
}> = ({mood, palette, children, fov = 26, post, ao = false, far = 80}) => {
  const {width, height} = useVideoConfig();
  const m = palette ?? MOODS[mood];
  const bg = useMemo(() => new THREE.Color(), []);
  bg.copy(raw(m.bg));
  return (
    <ThreeCanvas
      width={width}
      height={height}
      shadows="soft"
      gl={{antialias: false}}
      camera={{fov, near: 0.1, far, position: [4.6, 3.6, 8.6]}}
      style={{backgroundColor: m.bg}}
    >
      <primitive attach="background" object={bg} />
      {/* realistic objects' studio reflections, scaled per mood (1 in Day) */}
      <MoodLook.Provider value={{env: m.env, albedo: m.albedo}}>{children}</MoodLook.Provider>
      <MuseumPost
        vignette={m.vignette}
        softFocus={0.35}
        exposure={m.exposure}
        shoulder={m.shoulder}
        ao={ao ? m.ao : 0}
        {...post}
      />
    </ThreeCanvas>
  );
};

/**
 * The mood's lights (§ 4): hemisphere, one shadow-casting directional key, a fill, and in Night
 * the floor lamp's light. Intensities are the mock-up's × π (three's physical light units).
 */
export const SectionLights: React.FC<{
  mood: Mood;
  /** A blended palette (the time-passes beat); default the mood's own. */
  palette?: MoodPalette;
  /** Where the key points. */
  target?: V3;
  /** Lamp level multiplier (Night): 1 = as specified; the scene breathes it ±3%. */
  lamp?: number;
  /** World position of the lamp's light. */
  lampAt?: V3;
  /**
   * For slices much bigger than a room (a whole building): the shadow camera's half-size (default 3).
   * When set, the key keeps its direction but stands back from `target` by 3 × extent, and the map
   * grows to 2048.
   */
  extent?: number;
  /**
   * Night's narrow cool spot on the people (default true). It is aimed at the living room's couch
   * (near the origin); a slice with no one there (a car on a road) switches it off.
   */
  figureSpot?: boolean;
  /**
   * No. 010 (the time-lapse): the key (the sun) swung about the vertical through `target` by this angle (rad,
   * + counter-clockwise seen from above), so the shadows swing. Default 0 (unchanged).
   */
  keyYaw?: number;
}> = ({mood, palette, target = [0, 0.6, -0.2], lamp = 1, lampAt = [-1.45, 1.3, -0.75], extent, figureSpot = true, keyYaw = 0}) => {
  const m = palette ?? MOODS[mood];
  // created once; colours and intensities set every frame (so a blended palette just works)
  const lights = useMemo(() => {
    const hemi = new THREE.HemisphereLight();
    const key = new THREE.DirectionalLight();
    key.castShadow = true;
    // Soft PCF (the canvas's shadows="soft", § 2 "PCF soft"): plain PCF with radius 4 stepped the
    // penumbra into visible copies of the shadow edge at the close framings (vertical bands on the
    // trousers in the bookends' pull). Soft PCF filters it smooth; it ignores `radius`. Normal bias
    // 0.02 (≈ 3 texels of the ±3 shadow camera) against acne on the capsules; no peter-panning wide.
    key.shadow.mapSize.set(1024, 1024);
    Object.assign(key.shadow.camera, {left: -3, right: 3, top: 3, bottom: -3, near: 0.5, far: 14});
    key.shadow.radius = 4;
    key.shadow.bias = -0.0004;
    key.shadow.normalBias = 0.02;
    const fill = new THREE.DirectionalLight();
    // Day bounce: low, from the right front, so it lifts the walls (the left one most) more than the tops; no shadows
    const bounce = new THREE.DirectionalLight();
    // Night: a narrow cool spot on the couch (no shadows); 0 in Day so the light count never changes
    const fig = new THREE.SpotLight(0x000000, 0, 0, 0.33, 0.7, 0);
    return {hemi, key, fill, bounce, fig};
  }, []);
  lights.hemi.color.copy(raw(m.hemi[0]));
  lights.hemi.groundColor.copy(raw(m.hemi[1]));
  lights.hemi.intensity = m.hemi[2] * Math.PI;
  lights.key.color.copy(raw(m.key.color));
  lights.key.intensity = m.key.intensity * Math.PI;
  lights.fill.color.copy(raw(m.fill.color));
  lights.fill.intensity = m.fill.intensity * Math.PI;
  lights.bounce.color.copy(raw(m.bounce?.color ?? '#000000'));
  lights.bounce.intensity = (m.bounce?.intensity ?? 0) * Math.PI;
  lights.fig.color.copy(raw(m.figureLight?.color ?? '#000000'));
  lights.fig.intensity = figureSpot ? (m.figureLight?.intensity ?? 0) : 0;
  if (extent) {
    // same direction as the room's key (its position toward the room's default target), from far back
    const dir = new THREE.Vector3(...m.key.position).sub(new THREE.Vector3(0, 0.6, -0.2)).normalize();
    lights.key.position.set(...target).addScaledVector(dir, 3 * extent);
    const cam = lights.key.shadow.camera;
    if (cam.right !== extent) {
      Object.assign(cam, {left: -extent, right: extent, top: extent, bottom: -extent, near: 0.5, far: 6 * extent});
      cam.updateProjectionMatrix();
      lights.key.shadow.mapSize.set(2048, 2048);
      lights.key.shadow.map?.dispose();
      lights.key.shadow.map = null;
    }
  } else lights.key.position.set(...m.key.position);
  if (keyYaw) {
    const c = new THREE.Vector3(...target);
    lights.key.position.sub(c).applyAxisAngle(new THREE.Vector3(0, 1, 0), keyYaw).add(c);
  }
  lights.key.target.position.set(...target);
  lights.key.target.updateMatrixWorld();
  lights.fill.position.set(...m.fill.position);
  lights.bounce.position.set(...(m.bounce?.position ?? [0, 1, 1]));
  lights.fig.position.set(...(m.figureLight?.position ?? [0, 3, 2]));
  lights.fig.target.position.set(...(m.figureLight?.target ?? [0, 1, 0]));
  lights.fig.target.updateMatrixWorld();
  return (
    <>
      <primitive object={lights.hemi} />
      <primitive object={lights.key} />
      <primitive object={lights.key.target} />
      <primitive object={lights.fill} />
      <primitive object={lights.bounce} />
      <primitive object={lights.fig} />
      <primitive object={lights.fig.target} />
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
