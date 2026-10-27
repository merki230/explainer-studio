/*
 * Wheels that always read as rolling forward (No. 009, owner: "the tires' rotation feels like the car is going
 * backward"). Two causes, both fixed here:
 *
 *  1. Sign. `RealWheel` turns its parts by +`spin` about its local +x axle (three.js: +y toward +z). A car
 *     driving toward −z with its right wheel at yaw 0 (`DrivingCar`, `UtilityTruck` 'away') must turn its top
 *     toward −z, i.e. a NEGATIVE spin; those parts passed +travelled / R, so their wheels turned backward at
 *     every speed. At cruise this was hidden by aliasing (the bug and the strobe cancelled: at 26.8 m/s the
 *     wrong-way 142°/frame folds to a slow forward 2° on a 5-spoke rim).
 *  2. Aliasing at 30 fps. A 5-spoke rim repeats every 72°: any turn over 36° a frame is read as its nearest
 *     alias, often backward (30 m/s: 159°/frame → reads as −15°; 60 m/s: 318° → reads as −30°).
 *
 * The fix (`wheels: 'forward'`, see `WheelMode`): turn the wheel the right way, at a visual rate capped under the alias limit (`SAFE_STEP` a frame),
 * and let a smear of the spokes (`motionBlur`) carry the extra speed. The tread then slips against the road
 * above ≈ 5 m/s, which reads at MW and wider framings but shows in a tire close-up.
 */

/**
 * How a scene's wheels turn (owner, 2026-10-27: "wheels that spin backward must never happen again in a new
 * video, but already-posted videos must not change"). Every scene that turns a road wheel takes `wheels`:
 *  - 'forward': rolling the right way, the visual turn capped at `safeStep` a frame, the spokes smeared above
 *    the cap (`wheelSmear`). The default for every new video.
 *  - 'legacy': exactly as rendered in No. 001–008 (wrong sign on cars driving toward −z, no cap). Only for posted
 *    videos, which pin it once at the top of their spec (`VideoSpec.wheels`), so their renders never change.
 */
export type WheelMode = 'forward' | 'legacy';

/** The mode a scene uses when neither it nor its video says (`wheelMode`): new videos roll forward. */
export const DEFAULT_WHEELS: WheelMode = 'forward';

/** A scene's wheel mode: its own `wheels` prop, else `DEFAULT_WHEELS`. */
export const wheelMode = (m?: WheelMode | null): WheelMode => m ?? DEFAULT_WHEELS;

/** The scenes that take `wheels` (Explainer passes a video's `wheels` down to these only). */
export const WHEEL_SCENES = ['highway-slice', 'city-slice', 'street-slice', 'musical-road', 'car-slice', 'race-slice', 'drive-unit', 'wheel-slice'];

/** The largest visual turn a frame (rad) of a 5-spoke rim: 26°, well under half its period (36°). */
export const SAFE_STEP = 0.45;

/**
 * The largest visual turn a frame (rad) for a rim of `spokes` equal spokes: `SAFE_STEP` × 5 / spokes (the 10-blade
 * turbine face repeats every 36°: 13°).
 */
export const safeStep = (spokes = 5) => (SAFE_STEP * 5) / spokes;

/** Spokes on `RealWheel`'s faces: the alloy and 'split' have 5 (twin), 'turbine' 10. */
export const spokesOf = (sport?: {spokes: 'split' | 'turbine'} | null) => (sport?.spokes === 'turbine' ? 10 : 5);

/** The road speed (m/s) above which the visual turn is capped, for a wheel of radius `r` at `fps`. */
export const capSpeed = (r: number, fps: number, spokes = 5) => safeStep(spokes) * fps * r;

/** The same cap as a wheel speed in revolutions per second (scenes keyed in rev/s). */
export const capRevs = (fps: number, spokes = 5) => (safeStep(spokes) * fps) / (2 * Math.PI);

/**
 * ∫ min(|speed(x)|, cap) dt from 0 to t, signed by the speed (fixed step, deterministic): the metres the
 * wheel is drawn as having rolled.
 */
export const cappedTravel = (speed: (x: number) => number, t: number, cap: number) => {
  const STEP = 1 / 120;
  let a = 0;
  for (let x = 0; x < t; x += STEP) {
    const v = speed(x + Math.min(STEP, t - x) / 2);
    a += Math.sign(v) * Math.min(Math.abs(v), cap) * Math.min(STEP, t - x);
  }
  return a;
};

/**
 * The smear on the spokes (rad, unsigned): the real shutter blur below the cap, growing to `max` by 4× the cap
 * so a fast wheel reads as a blur rather than a slow one.
 */
export const wheelSmear = (realBlur: number, v: number, cap: number, max = 0.4) => {
  const u = Math.max(0, Math.min(1, (Math.abs(v) - cap) / (3 * cap)));
  return Math.max(Math.abs(realBlur), max * u * u * (3 - 2 * u));
};
