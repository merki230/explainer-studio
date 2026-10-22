import type {Transcript, VideoSpec} from '../types';
// `yarn new <slug>` adds lines between the markers below. Keep them.
// <imports>
import {spec as phoneListening} from './phone-listening/spec';
import phoneListeningTranscript from './phone-listening/transcript.json';
import {spec as lab} from './lab/spec';
import labTranscript from './lab/transcript.json';
import {spec as lightToData} from './light-to-data/spec';
import lightToDataTranscript from './light-to-data/transcript.json';
import {spec as tireSensor} from './tire-sensor/spec';
import tireSensorTranscript from './tire-sensor/transcript.json';
import {spec as elevatorDispatch} from './elevator-dispatch/spec';
import elevatorDispatchTranscript from './elevator-dispatch/transcript.json';
import {spec as waterMeter} from './water-meter/spec';
import waterMeterTranscript from './water-meter/transcript.json';
import {spec as rumbleStrips} from './rumble-strips/spec';
import rumbleStripsTranscript from './rumble-strips/transcript.json';
import {spec as onePedal} from './one-pedal/spec';
import onePedalTranscript from './one-pedal/transcript.json';
import {spec as evSound} from './ev-sound/spec';
import evSoundTranscript from './ev-sound/transcript.json';
// </imports>

export type VideoEntry = {spec: VideoSpec; transcript: Transcript};

/**
 * Every video in the studio. The key is the slug: it names the folder in
 * src/videos/ (which also holds its audio/ and release/), and the Remotion composition id.
 */
export const VIDEOS: Record<string, VideoEntry> = {
  // <entries>
  'phone-listening': {spec: phoneListening, transcript: phoneListeningTranscript as Transcript},
  'lab': {spec: lab, transcript: labTranscript as Transcript},
  'light-to-data': {spec: lightToData, transcript: lightToDataTranscript as Transcript},
  'tire-sensor': {spec: tireSensor, transcript: tireSensorTranscript as Transcript},
  'elevator-dispatch': {spec: elevatorDispatch, transcript: elevatorDispatchTranscript as Transcript},
  'water-meter': {spec: waterMeter, transcript: waterMeterTranscript as Transcript},
  'rumble-strips': {spec: rumbleStrips, transcript: rumbleStripsTranscript as Transcript},
  'one-pedal': {spec: onePedal, transcript: onePedalTranscript as Transcript},
  'ev-sound': {spec: evSound, transcript: evSoundTranscript as Transcript},
  // </entries>
};
