import type React from 'react';
import {PhoneCutawayScene} from './PhoneCutawayScene';
import {PhoneScene} from './PhoneScene';
import {ProfilesScene} from './ProfilesScene';
import {RoomScene} from './RoomScene';
import {SectionLabScene} from './SectionLabScene';
import {SectionRoomScene} from './SectionRoomScene';
import {WheelSliceScene} from './WheelSliceScene';
import {CarSliceScene} from './CarSliceScene';
import {TowerSliceScene} from './TowerSliceScene';
import {HotelLobbyScene} from './HotelLobbyScene';

/**
 * Scene registry. To add a scene: write a component that takes
 * {durationInFrames, ...yourProps}, then register it here under a short name.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SCENES: Record<string, React.FC<any>> = {
  phone: PhoneScene,
  room: RoomScene,
  profiles: ProfilesScene,
  'section-room': SectionRoomScene,
  'section-lab': SectionLabScene,
  'phone-cutaway': PhoneCutawayScene,
  'wheel-slice': WheelSliceScene,
  'car-slice': CarSliceScene,
  'tower-slice': TowerSliceScene,
  'hotel-lobby': HotelLobbyScene,
};

export type SceneName =
  | 'phone'
  | 'room'
  | 'profiles'
  | 'section-room'
  | 'section-lab'
  | 'phone-cutaway'
  | 'wheel-slice'
  | 'car-slice'
  | 'tower-slice'
  | 'hotel-lobby';
