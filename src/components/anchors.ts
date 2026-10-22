import {cityAnchorOnScreen, type CitySliceSceneProps} from '../scenes/CitySliceScene';
import {highwayAnchorOnScreen, type HighwaySliceSceneProps} from '../scenes/HighwaySliceScene';
import {hotelAnchorOnScreen, type HotelLobbySceneProps} from '../scenes/HotelLobbyScene';
import {musicalAnchorOnScreen, type MusicalRoadSceneProps} from '../scenes/MusicalRoadScene';
import {streetAnchorOnScreen, type StreetSliceSceneProps} from '../scenes/StreetSliceScene';
import {towerAnchorOnScreen, type TowerSliceSceneProps} from '../scenes/TowerSliceScene';

/** The scene an overlay sits on (set by Explainer). */
export type AnchorScene = {props: Record<string, unknown>; durationInFrames: number; offset: number; name?: string};

/** Scenes whose overlays can follow a named point (`anchor` on callouts, the head on name tags). */
export const ANCHOR_SCENES = [
  'tower-slice',
  'hotel-lobby',
  'street-slice',
  'highway-slice',
  'musical-road',
  'city-slice',
];

/**
 * A named point of the scene on screen (px) at this overlay's frame, following the camera and
 * anything that moves (a car, a walking person). `tower-slice`: 'youSpot', 'callButton:4[:up]',
 * 'carRoof:B', 'car:B', 'controllerAt', 'person:n'. `hotel-lobby`: 'keypad', 'door:C', 'wall:B',
 * 'youSpot', 'person:n', 'carRoof:C', 'car:C'. `street-slice`: 'cap', 'radio', 'register', 'meter', 'pole',
 * 'tank', 'cab', 'laptop', 'truckRoof', 'youSpot' (= 'youHead'), 'phone', 'tap', 'lid:k'. `highway-slice`: 'tire',
 * 'tail', 'grooveDepth', 'grooveNext', 'whiteLine', 'sign:speed' | 'sign:mile' | 'sign:guide'. `musical-road`: 'group:k', 'tire',
 * 'rearTire', 'car', 'window', 'house'. `city-slice`: 'car:k', 'lamps:k', 'youSpot', 'signal', 'stopLine',
 * 'sign:oneway' | 'sign:speed'. Undefined elsewhere
 * or for an unknown name.
 */
export const anchorOnScreen = (
  scene: AnchorScene,
  anchor: string,
  frame: number,
  fps: number,
): [number, number] | undefined => {
  const o = {frame: frame + scene.offset, fps, durationInFrames: scene.durationInFrames};
  if (scene.name === 'tower-slice') return towerAnchorOnScreen(scene.props as Partial<TowerSliceSceneProps>, anchor, o);
  if (scene.name === 'hotel-lobby') return hotelAnchorOnScreen(scene.props as Partial<HotelLobbySceneProps>, anchor, o);
  if (scene.name === 'street-slice')
    return streetAnchorOnScreen(scene.props as Partial<StreetSliceSceneProps>, anchor, o);
  if (scene.name === 'highway-slice')
    return highwayAnchorOnScreen(scene.props as Partial<HighwaySliceSceneProps>, anchor, o);
  if (scene.name === 'musical-road')
    return musicalAnchorOnScreen(scene.props as Partial<MusicalRoadSceneProps>, anchor, o);
  if (scene.name === 'city-slice') return cityAnchorOnScreen(scene.props as Partial<CitySliceSceneProps>, anchor, o);
  return undefined;
};
