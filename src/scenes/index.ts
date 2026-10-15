import type React from 'react';
import {PhoneScene} from './PhoneScene';
import {ProfilesScene} from './ProfilesScene';
import {RoomScene} from './RoomScene';
import {SectionRoomScene} from './SectionRoomScene';
import {TilesScene} from './TilesScene';

/**
 * Scene registry. To add a scene: write a component that takes
 * {durationInFrames, ...yourProps}, then register it here under a short name.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SCENES: Record<string, React.FC<any>> = {
  phone: PhoneScene,
  room: RoomScene,
  profiles: ProfilesScene,
  tiles: TilesScene,
  'section-room': SectionRoomScene,
};

export type SceneName = 'phone' | 'room' | 'profiles' | 'tiles' | 'section-room';
