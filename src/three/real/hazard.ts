/*
 * Hazard and beacon flashing on the **video clock** (No. 009), so a lamp's phase carries across cuts and
 * slides: the stopped car in a highway-slice, the same car cut open in a car-slice, and back again never
 * jump. Pure maths, no React. Flat lamps only (style guide § 1: never bloomed, no spill).
 */

/** Hazard flash rate (Hz): ≈ 1.4, inside the 60–120 flashes a minute US lamps use (FMVSS 108). */
export const HAZARD_HZ = 1.4;
/** Share of each cycle the hazard lamps are lit. */
export const HAZARD_DUTY = 0.5;

/**
 * The hazards' lamp level at `videoT` (seconds since the video's frame 0): 0 or 1, a hard on/off like an
 * LED lamp, lit for the first half of each cycle. 0 before `fromVideoT` (when they were switched on, in
 * video seconds; the phase never depends on it, so every scene agrees).
 */
export const hazardLevel = (videoT: number, fromVideoT: number | null | undefined) => {
  if (fromVideoT == null || videoT < fromVideoT) return 0;
  const u = videoT * HAZARD_HZ;
  return u - Math.floor(u) < HAZARD_DUTY ? 1 : 0;
};

/** A roof light bar's cycle (s): alternating halves, out of step with the hazards (`HAZARD_HZ`). */
export const BEACON_PERIOD = 0.6;

/**
 * A light bar's two halves at `videoT` (video seconds): [left, right], each 0 or 1. The left half is lit for
 * the first 45% of the cycle, the right half for 50–95%, so they alternate with a short dark gap.
 */
export const beaconLevels = (videoT: number): [number, number] => {
  const u = videoT / BEACON_PERIOD;
  const f = u - Math.floor(u);
  return [f < 0.45 ? 1 : 0, f >= 0.5 && f < 0.95 ? 1 : 0];
};
