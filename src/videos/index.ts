import type {Transcript, VideoSpec} from '../types';
// `yarn new <slug>` adds lines between the markers below. Keep them.
// <imports>
import {spec as phoneListening} from './phone-listening/spec';
import phoneListeningTranscript from './phone-listening/transcript.json';
import {spec as labSection} from './lab-section/spec';
import labSectionTranscript from './lab-section/transcript.json';
import {spec as labRealism} from './lab-realism/spec';
import labRealismTranscript from './lab-realism/transcript.json';
// </imports>

export type VideoEntry = {spec: VideoSpec; transcript: Transcript};

/**
 * Every video in the studio. The key is the slug: it names the folder in
 * src/videos/, the Remotion composition id, and the output file out/<slug>.mp4.
 */
export const VIDEOS: Record<string, VideoEntry> = {
  // <entries>
  'phone-listening': {spec: phoneListening, transcript: phoneListeningTranscript as Transcript},
  'lab-section': {spec: labSection, transcript: labSectionTranscript as Transcript},
  'lab-realism': {spec: labRealism, transcript: labRealismTranscript as Transcript},
  // </entries>
};
