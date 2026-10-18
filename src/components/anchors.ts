import {hotelAnchorOnScreen, type HotelLobbySceneProps} from '../scenes/HotelLobbyScene';
import {towerAnchorOnScreen, type TowerSliceSceneProps} from '../scenes/TowerSliceScene';

/** The scene an overlay sits on (set by Explainer). */
export type AnchorScene = {props: Record<string, unknown>; durationInFrames: number; offset: number; name?: string};

/** Scenes whose overlays can follow a named point (`anchor` on callouts, the head on name tags). */
export const ANCHOR_SCENES = ['tower-slice', 'hotel-lobby'];

/**
 * A named point of the scene on screen (px) at this overlay's frame, following the camera and
 * anything that moves (a car, a walking person). `tower-slice`: 'youSpot', 'callButton:4[:up]',
 * 'carRoof:B', 'car:B', 'controllerAt', 'person:n'. `hotel-lobby`: 'keypad', 'door:C', 'wall:B',
 * 'youSpot', 'person:n', 'carRoof:C', 'car:C'. Undefined elsewhere or for an unknown name.
 */
export const anchorOnScreen = (scene: AnchorScene, anchor: string, frame: number, fps: number): [number, number] | undefined => {
  const o = {frame: frame + scene.offset, fps, durationInFrames: scene.durationInFrames};
  if (scene.name === 'tower-slice') return towerAnchorOnScreen(scene.props as Partial<TowerSliceSceneProps>, anchor, o);
  if (scene.name === 'hotel-lobby') return hotelAnchorOnScreen(scene.props as Partial<HotelLobbySceneProps>, anchor, o);
  return undefined;
};
