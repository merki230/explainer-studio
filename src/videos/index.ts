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
  // </entries>
};
