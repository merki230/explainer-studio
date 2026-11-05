import {carAnchorOnScreen, type CarSliceSceneProps} from '../scenes/CarSliceScene';
import {cityAnchorOnScreen, type CitySliceSceneProps} from '../scenes/CitySliceScene';
import {driveUnitAnchorOnScreen, type DriveUnitSceneProps} from '../scenes/DriveUnitScene';
import {highwayAnchorOnScreen, type HighwaySliceSceneProps} from '../scenes/HighwaySliceScene';
import {hotelAnchorOnScreen, type HotelLobbySceneProps} from '../scenes/HotelLobbyScene';
import {musicalAnchorOnScreen, type MusicalRoadSceneProps} from '../scenes/MusicalRoadScene';
import {raceAnchorOnScreen, type RaceSliceSceneProps} from '../scenes/RaceSliceScene';
import {chargeAnchorOnScreen, type ChargeSliceSceneProps} from '../scenes/ChargeSliceScene';
import {teardownAnchorOnScreen, type TeardownSliceSceneProps} from '../scenes/TeardownSliceScene';
import {reportAnchorOnScreen, type ReportSliceSceneProps} from '../scenes/ReportSliceScene';
import {dcAnchorOnScreen, type DatacenterSliceSceneProps} from '../scenes/DatacenterSliceScene';
import {labAnchorOnScreen, type SectionLabSceneProps} from '../scenes/SectionLabScene';
import {townAnchorOnScreen, type TownSliceSceneProps} from '../scenes/TownSliceScene';
import {cityTwinAnchorOnScreen, type CityTwinSceneProps} from '../scenes/CityTwinScene';
import {recordsAnchorOnScreen, type RecordsSliceSceneProps} from '../scenes/RecordsSliceScene';
import {streetAnchorOnScreen, type StreetSliceSceneProps} from '../scenes/StreetSliceScene';
import {towerAnchorOnScreen, type TowerSliceSceneProps} from '../scenes/TowerSliceScene';
import type {Format} from '../theme';

/**
 * A scene's props with the frame format the overlay renders in (only added in the wide frame, so vertical props stay
 * exactly as the spec gave them): the scenes' anchor maths project with the format's size and lens. The Explainer
 * already hands horizontal scenes `format`; this covers a cover still or any caller that doesn't.
 */
export const withFormat = <T extends object>(props: T, format: Format): T =>
  format === 'horizontal' && (props as {format?: Format}).format === undefined ? {...props, format} : props;

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
  'race-slice',
  'drive-unit',
  'charge-slice',
  'teardown-slice',
  'report-slice',
  'datacenter-slice',
  'town-slice',
  'section-lab',
  'city-twin',
  'records-slice',
];

/**
 * A named point of the scene on screen (px) at this overlay's frame, following the camera and
 * anything that moves (a car, a walking person). `tower-slice`: 'youSpot', 'callButton:4[:up]',
 * 'carRoof:B', 'car:B', 'controllerAt', 'person:n'. `hotel-lobby`: 'keypad', 'door:C', 'wall:B',
 * 'youSpot', 'person:n', 'carRoof:C', 'car:C'. `street-slice`: 'cap', 'radio', 'register', 'meter', 'pole',
 * 'tank', 'cab', 'laptop', 'truckRoof', 'youSpot' (= 'youHead'), 'phone', 'tap', 'lid:k'. `highway-slice`: 'youSpot', 'tire',
 * 'tail', 'grooveDepth', 'grooveNext', 'whiteLine', 'sign:speed' | 'sign:mile' | 'sign:guide'. `musical-road`: 'group:k', 'tire',
 * 'rearTire', 'car', 'window', 'house'. `city-slice`: 'car:k', 'lamps:k', 'youSpot', 'signal', 'stopLine',
 * 'sign:oneway' | 'sign:speed'. `race-slice`: 'cluster:ev' | 'cluster:gas', 'top:ev' | 'top:gas' (just above
 * the car's roof), 'nose:*', 'tree:*', 'lane:*'. `drive-unit`: 'rotor', 'stage:1', 'stage:2', 'output', 'shift', 'hub',
 * 'patch', 'inverter'. `car-slice`: 'phone', 'cluster', 'head' (= 'youSpot'). `charge-slice`: 'top:top' | 'top:bottom'
 * (above a bay's roof), 'pack:*', 'port:*', 'cable:*', 'cabinet:*', 'lane:*', 'under:*', 'ghost', 'crate:*' (No. 011: the
 * standing supplier crate), 'blade:*' (the slid-out blade's tip). `teardown-slice`: 'pack', 'roof', 'grid', 'part:<id>'. `report-slice`: 'module', 'phone', 'top', 'company', 'rack',
 * 'printer', 'insurer', 'insurer:screen', 'tray', 'head'. `datacenter-slice`: 'fins', 'stream', 'valve', 'fill', 'basin', 'minerals', 'hose',
 * 'pipe', 'pipeClean' (= 'corrosion'), 'controller', 'jars', 'aiRack', 'racks', 'riser', 'tower', 'plume', 'drycooler', 'meter',
 * 'elecMeter', 'yard', 'drain'. `town-slice`: 'youSpot', 'gate', 'riverPlume', 'sampler', 'gauges', 'junction', 'plant',
 * 'ponds', 'house', 'field', 'fence', 'dcRoof', 'plantTower', 'meter'. `section-lab` (heat bench): 'clock', 'bar:jug1' |
 * 'bar:jug2' | 'bar:heater', 'jug1', 'jug2', 'heater'. `city-twin` (No. 014): '<part>:top|bottom' for 'engine', 'motor', 'battery',
 * 'inverter', 'nose', 'tail', 'top' (= 'roof', car tags), 'frontWheel', 'rearWheel', 'cluster', 'head'; 'lead:*', 'signal:*', 'lane:*'.
 * `records-slice` (No. 015): 'rack', 'monitor', 'desk', 'head', 'slab:n', 'tick:n', 'rulerEnd', 'ruler'. `city-slice` also (No. 015):
 * 'plate[:k]', 'rack[:k]', 'tail[:k]', 'lens', 'ledRing', 'antenna', 'modem', 'battery', 'housing', 'pole', 'ghost'.
 * `car-slice` also: 'engine', 'motor', 'battery', 'inverter', 'nose', 'tail', 'roof', 'frontWheel', 'rearWheel'. Undefined elsewhere
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
  if (scene.name === 'race-slice') return raceAnchorOnScreen(scene.props as Partial<RaceSliceSceneProps>, anchor, o);
  if (scene.name === 'drive-unit')
    return driveUnitAnchorOnScreen(scene.props as Partial<DriveUnitSceneProps>, anchor, o);
  if (scene.name === 'car-slice') return carAnchorOnScreen(scene.props as Partial<CarSliceSceneProps>, anchor, o);
  if (scene.name === 'charge-slice')
    return chargeAnchorOnScreen(scene.props as Partial<ChargeSliceSceneProps>, anchor, o);
  if (scene.name === 'teardown-slice')
    return teardownAnchorOnScreen(scene.props as Partial<TeardownSliceSceneProps>, anchor, o);
  if (scene.name === 'report-slice')
    return reportAnchorOnScreen(scene.props as Partial<ReportSliceSceneProps>, anchor, o);
  if (scene.name === 'datacenter-slice')
    return dcAnchorOnScreen(scene.props as Partial<DatacenterSliceSceneProps>, anchor, o);
  if (scene.name === 'town-slice')
    return townAnchorOnScreen(scene.props as Partial<TownSliceSceneProps>, anchor, o);
  if (scene.name === 'section-lab') return labAnchorOnScreen(scene.props as Partial<SectionLabSceneProps>, anchor, o);
  if (scene.name === 'city-twin') return cityTwinAnchorOnScreen(scene.props as Partial<CityTwinSceneProps>, anchor, o);
  if (scene.name === 'records-slice') return recordsAnchorOnScreen(scene.props as Partial<RecordsSliceSceneProps>, anchor, o);
  return undefined;
};
