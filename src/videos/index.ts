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
import {spec as selfCheckout} from './self-checkout/spec';
import selfCheckoutTranscript from './self-checkout/transcript.json';
import {spec as evSound} from './ev-sound/spec';
import evSoundTranscript from './ev-sound/transcript.json';
import {spec as evAcceleration} from './ev-acceleration/spec';
import evAccelerationTranscript from './ev-acceleration/transcript.json';
import {spec as driveByWire} from './drive-by-wire/spec';
import driveByWireTranscript from './drive-by-wire/transcript.json';
import {spec as mileMarkers} from './mile-markers/spec';
import mileMarkersTranscript from './mile-markers/transcript.json';
import {spec as evCharging} from './ev-charging/spec';
import evChargingTranscript from './ev-charging/transcript.json';
import {spec as bydPrice} from './byd-price/spec';
import bydPriceTranscript from './byd-price/transcript.json';
import {spec as insuranceApp} from './insurance-app/spec';
import insuranceAppTranscript from './insurance-app/transcript.json';
import {spec as datacenterWater} from './datacenter-water/spec';
import datacenterWaterTranscript from './datacenter-water/transcript.json';
import {spec as hybridCity} from './hybrid-city/spec';
import hybridCityTranscript from './hybrid-city/transcript.json';
import {spec as flockCamera} from './flock-camera/spec';
import flockCameraTranscript from './flock-camera/transcript.json';
import {spec as bladeBattery} from './blade-battery/spec';
import bladeBatteryTranscript from './blade-battery/transcript.json';
import {spec as evCost} from './ev-cost/spec';
import evCostTranscript from './ev-cost/transcript.json';
import {spec as evWinter} from './ev-winter/spec';
import evWinterTranscript from './ev-winter/transcript.json';
import {spec as homeHeat} from './home-heat/spec';
import homeHeatTranscript from './home-heat/transcript.json';
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
  'self-checkout': {spec: selfCheckout, transcript: selfCheckoutTranscript as Transcript},
  'ev-sound': {spec: evSound, transcript: evSoundTranscript as Transcript},
  'ev-acceleration': {spec: evAcceleration, transcript: evAccelerationTranscript as Transcript},
  'drive-by-wire': {spec: driveByWire, transcript: driveByWireTranscript as Transcript},
  'mile-markers': {spec: mileMarkers, transcript: mileMarkersTranscript as Transcript},
  'ev-charging': {spec: evCharging, transcript: evChargingTranscript as Transcript},
  'byd-price': {spec: bydPrice, transcript: bydPriceTranscript as Transcript},
  'insurance-app': {spec: insuranceApp, transcript: insuranceAppTranscript as Transcript},
  'datacenter-water': {spec: datacenterWater, transcript: datacenterWaterTranscript as Transcript},
  'hybrid-city': {spec: hybridCity, transcript: hybridCityTranscript as Transcript},
  'flock-camera': {spec: flockCamera, transcript: flockCameraTranscript as Transcript},
  'blade-battery': {spec: bladeBattery, transcript: bladeBatteryTranscript as Transcript},
  'ev-cost': {spec: evCost, transcript: evCostTranscript as Transcript},
  'ev-winter': {spec: evWinter, transcript: evWinterTranscript as Transcript},
  'home-heat': {spec: homeHeat, transcript: homeHeatTranscript as Transcript},
  // </entries>
};
