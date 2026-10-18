import React, {useMemo} from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {MOODS, type Mood} from '../theme';
import {projectToFrame, type Framing} from '../three/section/SectionCamera';
import {keypadAt, levelYAt, personHead, TOWER_DIM, towerLayout, towerResolver, TowerSlice, type StopTick, type TowerCar, type TowerLayout} from '../three/section/TowerSlice';
import {carStateAt, personAt, type PersonSpec} from '../three/section/towerMotion';
import {ease} from './keyframes';
import {closeScale, TowerStage, towerCameraAt, towerCameraMove, type FramingTable, type LiveLine, type TowerCameraKey} from './TowerSliceScene';

type V3 = [number, number, number];
/** Presets: 'lobby', 'wide', 'mid'; placed: 'keypad' (the keypad close-up, YOU's hand on its screen), 'car:X' (into car X at the scene's start). */
export type HotelFraming = 'lobby' | 'wide' | 'mid' | 'keypad' | `car:${string}`;

/**
 * Framings for the default hotel (4 shafts, 14 floors). `lobby`: the lobby, its four lettered doors,
 * the keypad, reception and the entrance. `wide`: a little wider (groups walking to their doors).
 * `mid`: a band of upper floors (6 to 10) where the cars stop.
 */
export const HOTEL_FRAMINGS: Record<'lobby' | 'wide' | 'mid', Framing> = {
  lobby: {look: [-0.2, 0.9, 1.8], distance: 54},
  wide: {look: [-0.2, 1.4, 1.6], distance: 62},
  mid: {look: [0.6, 22.6, -0.5], distance: 64},
};

/** No. 003's hotel cars (🎭 illustrative): A and C waiting at the lobby, B and D up the tower. */
export const HOTEL_CARS: Record<string, TowerCar> = {
  A: {level: 0},
  B: {level: 8},
  C: {level: 0},
  D: {level: 12},
};

/** A destination entry: from `at` an orange line runs from the keypad along the floor to the car's door. */
export type KeypadEntry = {
  /** The car assigned (a door letter). */
  car: string;
  at: number;
  /** Draw time, s (default 0.9). */
  draw?: number;
  /** Fades to its node dots from here (the trace), gone by `until`. */
  fade?: number;
  until?: number;
};

export type HotelLobbySceneProps = {
  durationInFrames: number;
  mood?: Mood;
  /** Floors above the lobby (default 14). */
  floors?: number;
  letters?: string[];
  /** Cars as on `tower-slice` (keys, doors, riders, …). Default: A and C at the lobby, B at 8, D at 12. */
  cars?: Record<string, TowerCar>;
  /**
   * YOU (a PersonSpec without `who`): default standing at the keypad. Spots: 'entrance' (the street
   * door, right wing), 'keypad', 'desk', 'door:X', 'wait:n', 'wall:X' (the bare wall beside door X),
   * 'car:X' (rides car X), or [x, z]. null for nobody.
   */
  you?: Omit<PersonSpec, 'who'> | null;
  /** Guests (extras by default; `suitcase` for luggage), same spots. */
  guests?: PersonSpec[];
  /** Keypad entries: orange lines keypad → door. */
  entries?: KeypadEntry[];
  /** Stop ticks on the slabs' cut faces (solid: the one real stop; dashed: a mixed load's maybes). */
  stops?: StopTick[];
  framing?: HotelFraming;
  camera?: {from: Framing; to?: Framing};
  /** Camera keys; a key may name a framing (`{at, framing: 'lobby'}`); `log: true` for a steady dolly. */
  cameraKeys?: TowerCameraKey[];
  push?: number;
  drift?: number;
  location?: string;
  transition?: 'auto' | 'continue' | 'glide' | 'cut' | 'dissolve' | 'slide' | 'follow';
  follow?: {direction?: 'down' | 'up' | 'left' | 'right'; at?: number};
  glide?: number;
  startFrame?: number;
  cameraFrom?: Framing;
  cameraGlide?: number;
};

const hotelLayout = (p: Partial<HotelLobbySceneProps>) => towerLayout((p.letters ?? ['A', 'B', 'C', 'D']).length, p.floors ?? 14, {hotel: true});

/**
 * The hotel's framings: the presets plus the placed close-ups. `keypad`: the destination keypad on
 * its pedestal and the hand of whoever stands at it, the lobby doors behind. `car:X`: into car X.
 */
export const hotelFramings =
  (p: Partial<HotelLobbySceneProps>): FramingTable =>
  (name) => {
    const L = hotelLayout(p);
    const letters = p.letters ?? ['A', 'B', 'C', 'D'];
    const [kind, arg] = name.split(':');
    if (kind === 'keypad') {
      const k = keypadAt(L);
      return {look: [k.x - 0.12, 1.12, k.z - 0.25], distance: 3.6};
    }
    const shaft = letters.indexOf(arg ?? '');
    const car = (p.cars ?? HOTEL_CARS)[arg ?? ''];
    if (kind === 'car' && shaft >= 0 && car) {
      const lv = carStateAt(car, 0).level;
      return {look: [L.shaftX[shaft] - 0.42, levelYAt(L, lv) + 1.15, TOWER_DIM.car.front - TOWER_DIM.car.d / 2 + 0.3], distance: 6.8};
    }
    return (HOTEL_FRAMINGS as Record<string, Framing>)[name];
  };

export const hotelCameraStart = (p: Partial<HotelLobbySceneProps>, d: number, fps: number): Framing =>
  towerCameraMove({...p, cameraFrom: undefined, cameraGlide: undefined}, d, fps, 0, hotelFramings(p), 'lobby').from;
export const hotelCameraEnd = (p: Partial<HotelLobbySceneProps>, d: number, fps: number): Framing =>
  towerCameraMove(p, d, fps, undefined, hotelFramings(p), 'lobby').to;

export const hotelPeople = (p: Partial<HotelLobbySceneProps>): PersonSpec[] => {
  const you = p.you === undefined ? {start: 'keypad'} : p.you;
  return [...(you ? [{...you, who: 'you' as const, seed: 'you', start: you.start ?? 'entrance'}] : []), ...(p.guests ?? []).map((g) => ({start: 'entrance', ...g}))];
};

/** The keypad → door route along the lobby floor, right angles (world). */
export const keypadRoute = (L: TowerLayout, letters: string[], car: string): {legs: V3[][]; end: V3} | null => {
  const i = letters.indexOf(car);
  if (i < 0) return null;
  const k = keypadAt(L);
  const y = 0.014;
  const x = L.shaftX[i];
  const zLane = 0.42 + 0.06 * i;
  const end: V3 = [x, 0.035, -0.02];
  const pts: V3[] = [k.node, [k.x, y, k.z], [k.x, y, zLane], [x, y, zLane], [x, y, end[2]], end];
  return {legs: pts.slice(0, -1).map((p, j) => [p, pts[j + 1]]), end};
};

/** Named points (world) at t: 'keypad', 'door:C', 'wall:B', 'youSpot', 'person:n', 'carRoof:C', 'car:C'. */
export const hotelAnchorPoint = (p: Partial<HotelLobbySceneProps>, anchor: string, t: number): V3 | undefined => {
  const letters = p.letters ?? ['A', 'B', 'C', 'D'];
  const L = hotelLayout(p);
  const cars = p.cars ?? HOTEL_CARS;
  const [kind, a] = anchor.split(':');
  const people = hotelPeople(p);
  const R = towerResolver(L, letters, cars);
  if (kind === 'keypad') return keypadAt(L).screen;
  if (kind === 'youSpot' || kind === 'you') {
    const i = people.findIndex((q) => q.who === 'you');
    return i < 0 ? undefined : personHead(personAt(people[i], i, t, R));
  }
  if (kind === 'person') {
    const i = Number(a) + (p.you === null ? 0 : 1);
    return people[i] ? personHead(personAt(people[i], i, t, R)) : undefined;
  }
  const shaft = letters.indexOf(a ?? '');
  if (shaft < 0) return undefined;
  if (kind === 'door') return [L.shaftX[shaft], TOWER_DIM.door.h, -0.15];
  if (kind === 'wall') return [L.pierX(Math.min(shaft, L.shafts - 2)), 1.25, TOWER_DIM.frontOut];
  if (!cars[a]) return undefined;
  const st = carStateAt(cars[a], t);
  if (kind === 'carRoof') return [L.shaftX[shaft], levelYAt(L, st.level) + TOWER_DIM.car.h + 0.5, TOWER_DIM.car.front];
  if (kind === 'car') return [L.shaftX[shaft], levelYAt(L, st.level) + 1.2, TOWER_DIM.car.front];
  return undefined;
};

export const hotelCameraAt = (p: Partial<HotelLobbySceneProps>, o: {frame: number; fps: number; durationInFrames: number}) =>
  towerCameraAt(p, o, hotelFramings(p), 'lobby');

export const hotelAnchorOnScreen = (
  p: Partial<HotelLobbySceneProps>,
  anchor: string,
  o: {frame: number; fps: number; durationInFrames: number},
): [number, number] | undefined => {
  const w = hotelAnchorPoint(p, anchor, o.frame / o.fps);
  return w ? projectToFrame(hotelCameraAt(p, o), w) : undefined;
};

/**
 * K, the hotel (No. 003): the tower kit as a hotel. The lobby is cut open across its front: four
 * lettered elevator doors (A–D, full brushed-steel leaves) with no call buttons beside them,
 * reception in the left wing, the street entrance in the right, and the destination keypad on its
 * pedestal, its screen tilted toward its user (the camera sees its back; read it through the detail
 * box). Entries send orange lines from the keypad along the floor to the assigned door. Above, the
 * tower's floors and shafts as on `tower-slice` (the `mid` framing).
 */
export const HotelLobbyScene: React.FC<HotelLobbySceneProps> = (props) => {
  const {durationInFrames, mood = 'day', letters = ['A', 'B', 'C', 'D'], cars = HOTEL_CARS, entries = [], startFrame = 0} = props;
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const L = useMemo(() => hotelLayout(props), [props.letters, props.floors]); // eslint-disable-line react-hooks/exhaustive-deps
  const {from, to, pre} = towerCameraMove(props, durationInFrames, fps, frame, hotelFramings(props), 'lobby');
  const cam = hotelCameraAt(props, {frame, fps, durationInFrames});
  // lines and node dots thin as the camera comes in (the keypad close-up), as on the tower
  const kc = closeScale(cam.position.distanceTo(cam.look), HOTEL_FRAMINGS.lobby.distance);
  const people = hotelPeople(props);
  const lines: LiveLine[] = entries.flatMap((e, i) => {
    const r = keypadRoute(L, letters, e.car);
    if (!r || t < e.at) return [];
    const progress = ease(t, e.at, e.at + (e.draw ?? 0.9));
    const fade = e.fade === undefined ? 1 : 1 - ease(t, e.fade, e.fade + 0.5);
    const out = e.until === undefined ? 1 : 1 - ease(t, e.until - 0.4, e.until);
    if (out <= 0.001) return [];
    return [{key: `${i}`, legs: r.legs, end: r.end, radius: 0.028 * kc, glow: fade * out, progress, flow: undefined, locked: false, pulses: []}];
  });
  const k = keypadAt(L);
  return (
    <AbsoluteFill style={{backgroundColor: MOODS[mood].bg}}>
      <TowerStage
        mood={mood}
        L={L}
        from={from}
        to={to}
        pre={pre}
        durationInFrames={durationInFrames}
        drift={props.drift ?? 0}
        startFrame={startFrame}
        fps={fps}
        lines={lines}
        t={t}
        node={lines.length ? k.node : null}
        nodeScale={kc}
      >
        <TowerSlice mood={mood} layout={L} letters={letters} cars={cars} people={people} calls={[]} stops={props.stops} t={t} clockOffset={startFrame / fps} />
      </TowerStage>
    </AbsoluteFill>
  );
};
