import React, {useMemo} from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {CAR, MOODS, section, type Mood} from '../theme';
import {OrangePath} from '../three/OrangePath';
import {raw} from '../three/plaster';
import {PushArrow, pushArrowState, type PushArrowKeys} from '../three/PushArrow';
import {DriveUnit, EV, EV2, evDriveRoute, twoSpeedPoint, type TwoSpeedPoint} from '../three/real/EvDrive';
import {RealWheel} from '../three/real/RealWheel';
import {cutMaterial, CutOutline, type Rect} from '../three/section/cutLook';
import {projectToFrame, SECTION_ANGLE, SectionCamera, sectionCameraAt, type Framing} from '../three/section/SectionCamera';
import {SectionLights, SectionStage} from '../three/section/SectionStage';
import {skyTexture} from '../three/section/textures';
import {ease, framingAtKeys, speedAt, type CameraKey, type SpeedKey} from './keyframes';

/** The path's core radius at the wide framings (style guide § 5's vibration / energy path, `VIB_R`). */
const VIB_R = 0.0225;

type V3 = [number, number, number];

export type DriveUnitFraming = 'unit' | 'gears';

/** A soft neutral fill light into the gear case (white light, not a palette colour). */
const FILL = raw('#ffffff');

/**
 * The unit's own frame (`EvDrive`, x forward) → the world: centred near the origin and mirrored in x, so
 * the unit faces left like the cars in a left-facing slice (forward = screen left) and the wheel sits at
 * frame left, clear of the gears. (Facing right is not offered: at the fixed angle the wheel, nearer the
 * camera, would land on the gears.)
 */
const CENTRE: V3 = [1.36, 0.56, 0.4];
const toWorld = (p: V3): V3 => [-(p[0] - CENTRE[0]), p[1] - CENTRE[1], p[2] - CENTRE[2]];

/** The unit's forward direction in the world (the way the push at the contact patch points): −x. */
export const DRIVE_UNIT_FORWARD: V3 = [-1, 0, 0];

/** Framings at the fixed angle (world metres; set on test stills). */
export const driveUnitFramings = (): Record<DriveUnitFraming, Framing> => {
  return {
    // M: the whole cut-away, inverter (≈ y 380) to the road piece; the contact patch ≈ y 990, above the captions
    unit: {look: [0.067, -0.306, 0.1], distance: 5.2},
    // C: the two stages, the shift element, the output and the contact patch (≈ y 990, for the push arrow);
    // closer than this the first stage's wheel leaves the safe zone's top (y 288)
    gears: {look: [-0.037, -0.38, -0.1], distance: 4.4},
  };
};

export type DriveUnitSceneProps = {
  durationInFrames: number;
  /** Day (default) or Night. */
  mood?: Mood;
  /** 'unit' (default; M, the whole cut-away) or 'gears' (C, the two stages and the output). */
  framing?: DriveUnitFraming;
  /** A custom move instead of a preset (look-at + distance at the fixed angle). */
  camera?: {from: Framing; to?: Framing};
  /** Camera keyframes (as on `wheel-slice`): override `camera`, `push` and the glide in. E.g. `unit` → `gears`. */
  cameraKeys?: CameraKey[];
  /** Push toward the subject, units/s (default 0). */
  push?: number;
  /** Idle sideways drift, ± units (default 0). */
  drift?: number;
  /**
   * The output's (the wheel's) speed on screen, revolutions per second (slow motion: the rotor turns
   * `ratio` × as fast). Each key eases in over `spinRamp` s. Default [{at: 0, speed: 0.1}]: the rotor at
   * 1.5 rev/s in first, below the ≈ 1.9 rev/s where its 8 magnet pairs start to strobe at 30 fps.
   */
  spin?: SpeedKey[];
  /** Seconds each speed change takes (default 0.8). */
  spinRamp?: number;
  /** Gear keys: from `at` (s) the unit shifts to `gear` over `shiftFor` s. Default [{at: 0, gear: 1}]. */
  gear?: {at: number; gear: 1 | 2}[];
  /** Seconds a shift takes (default 0.3): the fork slides, the ratio (and the rotor's speed) eases across. */
  shiftFor?: number;
  /** Overall ratios [first, second] (default `EV2.ratios`, 15 and 8). */
  ratios?: [number, number];
  /**
   * From this second (default none: unlit) the push runs orange through the engaged stage: that stage's
   * wheel, the output gear and the windings glow; at a shift the glow passes to the other stage.
   */
  litAt?: number;
  /** The glow fades out from this second (over 0.5 s). Default none. */
  fadeAt?: number;
  /** Seconds at which both stage wheels outline once in orange (in 0.2 s, hold 0.3 s, out 0.4 s). Default none. */
  outlineAt?: number[];
  /** Light the motor windings with the push (default true; a steady glow, the rotor is fast). */
  windings?: boolean;
  /**
   * The push arrow at the tire's contact patch (`driveUnitPoint('patch')`), along the road piece's cut face,
   * pointing forward (`DRIVE_UNIT_FORWARD`): `length` keys 0 → 1 × `full` (default 0.4 m, 🎭 illustrative), a
   * node dot at zero, one-shot `brighten` seconds (see `PushArrowKeys`). Default none.
   */
  pushArrow?: PushArrowKeys | null;
  /**
   * The drive path through the unit (orange): from `at` the inverter → down the phase cables to the windings,
   * then the rotor → the engaged stage's wheel → the output gear → along the half-shaft to the hub, over
   * `drawFor` s (default 2.4; the electrical leg takes the first 40%). It follows the shift: the stage leg
   * moves to the engaged stage as the fork slides. `fadeAt`: it fades (0.5 s). Default none.
   */
  path?: {at: number; drawFor?: number; fadeAt?: number} | null;
  /** Which location this is (default 'drive-unit'). */
  location?: string;
  transition?: 'auto' | 'continue' | 'glide' | 'cut' | 'dissolve' | 'slide' | 'follow';
  follow?: {direction?: 'down' | 'up' | 'left' | 'right'; at?: number};
  glide?: number;
  /** Set by Explainer. */
  startFrame?: number;
  cameraFrom?: Framing;
  cameraGlide?: number;
};

/** The camera move from the props (a preset or custom, continuing or gliding from the last scene). */
const unitCameraMove = (
  p: Partial<DriveUnitSceneProps>,
  durationInFrames: number,
  fps: number,
  frame?: number,
): {from: Framing; to: Framing; pre?: {from: Framing; hold: number; move: number; ease: 'cubic'}} => {
  const F = driveUnitFramings();
  if (p.cameraKeys && p.cameraKeys.length) {
    const base = p.camera?.from ?? F[p.framing ?? 'unit'];
    const t = frame === undefined ? Infinity : frame / fps;
    const f = framingAtKeys(p.cameraKeys, base, t);
    return {from: f, to: f};
  }
  const push = p.push ?? 0;
  const pre =
    p.cameraGlide && p.cameraFrom
      ? {from: p.cameraFrom, hold: 0, move: Math.max(1, Math.round(p.cameraGlide * fps)), ease: 'cubic' as const}
      : undefined;
  const secs = Math.max(0, durationInFrames - (pre ? pre.move : 0)) / fps;
  if (p.camera) return {from: p.camera.from, to: p.camera.to ?? p.camera.from, pre};
  const preset = F[p.framing ?? 'unit'];
  return {from: preset, to: {look: preset.look, distance: preset.distance - push * secs}, pre};
};

export const driveUnitCameraStart = (p: Partial<DriveUnitSceneProps>, d: number, fps: number): Framing =>
  unitCameraMove({...p, cameraFrom: undefined, cameraGlide: undefined}, d, fps, 0).from;
export const driveUnitCameraEnd = (p: Partial<DriveUnitSceneProps>, d: number, fps: number): Framing =>
  unitCameraMove(p, d, fps).to;

const cameraAtFrame = (p: Partial<DriveUnitSceneProps>, frame: number, fps: number, durationInFrames: number) => {
  const {from, to, pre} = unitCameraMove(p, durationInFrames, fps, frame);
  return sectionCameraAt({from, to, pre, frame, fps, durationInFrames, drift: p.drift ?? 0, clockOffset: (p.startFrame ?? 0) / fps});
};

/** The shift at t: 0 = first engaged → 1 = second, each gear key eased (cubic) over `shiftFor`. */
const shiftAt = (p: Partial<DriveUnitSceneProps>, t: number) => {
  const keys = [...(p.gear ?? [{at: 0, gear: 1 as const}])].sort((a, b) => a.at - b.at);
  const dur = Math.max(1 / 30, p.shiftFor ?? 0.3);
  let v = keys[0] && keys[0].at <= 0 ? (keys[0].gear === 2 ? 1 : 0) : 0;
  for (const k of keys) {
    if (t < k.at) break;
    const target = k.gear === 2 ? 1 : 0;
    v = v + (target - v) * ease(t, k.at, k.at + dur);
  }
  return v;
};

const STEP = 1 / 120;
/**
 * The unit's state at t: the output's and the rotor's turns (revolutions; the rotor integrates the
 * output speed × the ratio of the moment, so it never jumps at a shift), the shift, the ratio, the speeds.
 */
export const driveUnitStateAt = (p: Partial<DriveUnitSceneProps>, t: number) => {
  const keys = p.spin ?? [{at: 0, speed: 0.1}];
  const ramp = p.spinRamp ?? 0.8;
  const [r1, r2] = p.ratios ?? EV2.ratios;
  const ratio = (x: number) => r1 + (r2 - r1) * shiftAt(p, x);
  let out = 0;
  let rotor = 0;
  for (let x = 0; x < t; x += STEP) {
    const dt = Math.min(STEP, t - x);
    const w = speedAt(keys, x + dt / 2, ramp);
    out += w * dt;
    rotor += w * ratio(x + dt / 2) * dt;
  }
  const speed = speedAt(keys, t, ramp);
  return {outRevs: out, rotorRevs: rotor, shift: shiftAt(p, t), ratio: ratio(t), speed, rotorSpeed: speed * ratio(t)};
};

/** How lit the push is at t (0 → 1), from `litAt` and `fadeAt`. */
const litK = (p: Partial<DriveUnitSceneProps>, t: number) =>
  p.litAt === undefined ? 0 : ease(t, p.litAt, p.litAt + 0.3) * (p.fadeAt === undefined ? 1 : 1 - ease(t, p.fadeAt, p.fadeAt + 0.5));

/** The one-shot outline (both stages) at t. */
const outlineK = (p: Partial<DriveUnitSceneProps>, t: number) =>
  (p.outlineAt ?? []).reduce((m, a) => Math.max(m, ease(t, a, a + 0.2) * (1 - ease(t, a + 0.5, a + 0.9))), 0);

/** A named point of the unit in the world (for 3D parts: N4's push arrow sits on 'patch', pointing `DRIVE_UNIT_FORWARD`). */
export const driveUnitPoint = (what: TwoSpeedPoint): V3 => toWorld(twoSpeedPoint(what));

/**
 * Where a named point of the unit is on screen (px) at a frame, for callouts: 'stage:1', 'stage:2' (the
 * stage wheels' centres), 'output', 'shift', 'rotor', 'hub', 'patch' (the contact patch), 'inverter'.
 */
export const driveUnitAnchorOnScreen = (
  p: Partial<DriveUnitSceneProps>,
  what: string,
  o: {frame: number; fps: number; durationInFrames: number},
): [number, number] | undefined => {
  const names: TwoSpeedPoint[] = ['rotor', 'stage:1', 'stage:2', 'output', 'shift', 'hub', 'patch', 'inverter'];
  if (!names.includes(what as TwoSpeedPoint)) return undefined;
  const cam = cameraAtFrame(p, o.frame, o.fps, o.durationInFrames);
  return projectToFrame(cam, driveUnitPoint(what as TwoSpeedPoint));
};

/**
 * U, the drive unit (No. 007): a generic two-speed electric drive unit cut open at its mid-plane and
 * floating on the sky (an object cut-away): the motor (stator, copper, the rotor and its magnets), the
 * inverter, the gear case with the first stage (big wheel) and second stage (smaller wheel), the shift
 * element between them, the output gear, the half-shaft to a wheel stub with a tire segment on a piece
 * of road. The rotor turns at the output's speed × the engaged ratio (15 or 8 by default), in slow
 * motion; gear keys shift with a short fork slide. Orange only for the push through the engaged stage.
 */
export const DriveUnitScene: React.FC<DriveUnitSceneProps> = (props) => {
  const {durationInFrames, mood = 'day', startFrame = 0, windings = true} = props;
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const m = MOODS[mood];
  const {from, to, pre} = unitCameraMove(props, durationInFrames, fps, frame);
  const cam = cameraAtFrame(props, frame, fps, durationInFrames);
  const dist = cam.position.distanceTo(cam.look);

  const sky = useMemo(() => new THREE.MeshBasicMaterial({map: skyTexture(mood), fog: false}), [mood]);
  sky.color.setScalar(1 / m.exposure);
  const roadMats = useMemo(() => {
    const cut = cutMaterial();
    const top = new THREE.MeshStandardMaterial({color: raw(CAR[mood].asphalt), roughness: 0.92});
    return [cut, cut, top, cut, cut, cut];
  }, [mood]);

  const st = driveUnitStateAt(props, t);
  // forward rolling turns the wheel clockwise seen from the cut side (x forward); the rotor turns with the output
  const wheelSpin = -st.outRevs * Math.PI * 2;
  const rotorSpin = -st.rotorRevs * Math.PI * 2;
  // the turn while a 180° shutter is open (the rotor's magnet ghosts)
  const rotorBlur = (-st.rotorSpeed * Math.PI * 2 * 0.5) / fps;
  const lit = litK(props, t);
  const ol = outlineK(props, t);
  const slots = windings && lit > 0.003 ? [...Array(24).keys()].map(() => 0.55 * lit) : undefined;
  // ink thins in the close framing (as on car-slice)
  const inkScale = Math.max(0.03, Math.min(1, dist / 12.75));
  // the wheel: coaxial with the output gear, cut through its axle plane with the half toward the gearbox
  // removed (its cut face, the tire's two profiles and the contact patch, toward the camera)
  const wheelAt = driveUnitPoint('hub');
  const wheelSpinW = st.outRevs * Math.PI * 2;
  const wheelBlur = (st.speed * Math.PI * 2 * 0.5) / fps;
  // the road piece under it: asphalt on top, cut on the near side and both ends
  const gy = wheelAt[1] - EV2.tireR;
  const road = {x0: wheelAt[0] - 0.42, x1: wheelAt[0] + 0.42, y0: gy - 0.07, y1: gy, z0: wheelAt[2] - 0.2, z1: wheelAt[2] + 0.2};
  const roadRects: Rect[] = [
    [[road.x0, road.y0, road.z1], [road.x1, road.y1, road.z1]],
    [[road.x0, road.y0, road.z0], [road.x0, road.y1, road.z1]],
    [[road.x1, road.y0, road.z0], [road.x1, road.y1, road.z1]],
  ];

  // the push arrow on the road piece's cut face, from the contact patch forward
  const patch = driveUnitPoint('patch');
  const pa = props.pushArrow ? pushArrowState(props.pushArrow, t, 0.4) : null;
  const pathR = VIB_R * Math.max(0.3, Math.min(1, Math.round((dist / 9) * 20) / 20));
  // the drive path: the electrical leg, then the mechanical one through each stage (weighted by the shift)
  const pk = props.path ?? null;
  const pFor = Math.max(0.1, pk?.drawFor ?? 2.4);
  const pGlow = pk ? (pk.fadeAt === undefined ? 1 : 1 - ease(t, pk.fadeAt, pk.fadeAt + 0.5)) : 0;
  const pElec = pk ? ease(t, pk.at, pk.at + 0.4 * pFor) : 0;
  const pMech = pk ? ease(t, pk.at + 0.4 * pFor, pk.at + pFor) : 0;
  const unitPaths = useMemo(() => {
    const fz = EV.gearZ + 0.012;
    const o = EV2.out.c;
    const mech = (stage: 'stage:1' | 'stage:2'): V3[] =>
      [
        [EV.motor[0], EV.motor[1], EV.motorZ + 0.03],
        [twoSpeedPoint(stage)[0], twoSpeedPoint(stage)[1], fz],
        [o[0], o[1], fz],
        [o[0], o[1] + 0.03, EV.gearZ + 0.08],
        [o[0], o[1] + 0.03, EV2.hubZ - 0.02],
        [o[0], o[1], EV2.wheelZ],
      ] as V3[];
    return {
      elec: evDriveRoute().phase.map(toWorld),
      mech: [mech('stage:1').map(toWorld), mech('stage:2').map(toWorld)],
    };
  }, []);
  const pathProps = {stain: false, radius: pathR, coreColor: section.orange, halo: {scale: 0.055 / 0.018, opacity: 0.25}};

  return (
    <AbsoluteFill>
      <SectionStage mood={mood} post={{focusY: 0.4}} ao>
        <SectionCamera from={from} to={to} pre={pre} durationInFrames={durationInFrames} drift={props.drift ?? 0} clockOffset={startFrame / fps} />
        <SectionLights mood={mood} target={[0, 0, 0]} lamp={0} figureSpot={false} />
        <mesh position={[0, 6, -9]} material={sky}>
          <planeGeometry args={[60, 40]} />
        </mesh>
        <group scale={[-1, 1, 1]} position={[CENTRE[0], -CENTRE[1], -CENTRE[2]]}>
          <DriveUnit
            mood={mood}
            stages={2}
            wheelSpin={wheelSpin}
            rotorSpin={rotorSpin}
            rotorBlur={rotorBlur}
            slots={slots}
            inkScale={inkScale}
            shift={st.shift}
            stageGlow={[lit * (1 - st.shift), lit * st.shift]}
            stageOutline={[ol, ol]}
            outputGlow={lit}
          />
        </group>
        <RealWheel
          mood={mood}
          position={wheelAt}
          yaw={-Math.PI / 2}
          radius={EV2.tireR}
          cut="axle"
          spin={wheelSpinW}
          motionBlur={wheelBlur}
          valve={false}
          grounded
          inkScale={inkScale}
        />
        <mesh
          position={[(road.x0 + road.x1) / 2, (road.y0 + road.y1) / 2, (road.z0 + road.z1) / 2]}
          material={roadMats}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[road.x1 - road.x0, road.y1 - road.y0, road.z1 - road.z0]} />
        </mesh>
        <CutOutline rects={roadRects} thickness={0.011 * inkScale} />
        {pk && pGlow > 0.01 && t >= pk.at ? (
          <>
            <OrangePath legs={[unitPaths.elec]} progress={pElec} glow={pGlow} runner={pElec < 1} {...pathProps} />
            {[1 - st.shift, st.shift].map((w, i) =>
              pMech > 0 && w * pGlow > 0.01 ? (
                <OrangePath key={i} legs={[unitPaths.mech[i]]} progress={pMech} glow={w * pGlow} runner={pMech < 1} {...pathProps} />
              ) : null,
            )}
          </>
        ) : null}
        {pa ? (
          <PushArrow
            // on the cut face, slid along x so its tail sits under the patch on screen (the face is 0.2 m nearer the camera)
            position={[patch[0] + ((road.z1 + 0.012 - patch[2]) * SECTION_ANGLE[0]) / SECTION_ANGLE[2], road.y1 - 0.045 * (pathR / VIB_R), road.z1 + 0.012]}
            direction={DRIVE_UNIT_FORWARD}
            length={pa.length}
            brighten={pa.brighten}
            radius={0.03 * (pathR / VIB_R)}
          />
        ) : null}
        {/* a soft neutral light into the gear case, so the steel reads against the hatched cut */}
        <pointLight position={[0.2, 0.3, 1.2]} color={FILL} intensity={0.8} distance={3} decay={2} />
      </SectionStage>
    </AbsoluteFill>
  );
};
