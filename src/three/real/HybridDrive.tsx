import React, {useMemo} from 'react';
import * as THREE from 'three';
import {ease, keyedValue, type Keyed} from '../../scenes/keyframes';
import {section, type Mood} from '../../theme';
import {raw} from '../plaster';
import {OrangePath} from '../OrangePath';
import {BatteryPack, DriveUnit, EV, evDriveRoute, layoutModuleSpan, type PackLayout} from './EvDrive';

type V3 = [number, number, number];

/*
 * No. 014 (`hybrid-city`, N1): a generic full hybrid's systems, in the car's own frame (`RealCar`: x forward, y up, the
 * near cut at z = 0.8; metres), for `SlicedCar` `variant: 'hybrid'`. The engine is the gas car's transverse
 * four-cylinder (`EngineBay`, mounted by `SlicedCar` with its intake left out); beside it, toward the firewall, the
 * motor-generator: the electric car's drive unit (`DriveUnit`: motor, reduction gears, inverter, half-shaft) drawn at
 * `HYBRID.mgScale` round its final gear, so it stays on the front axle. A small HV battery (`BatteryPack` with
 * `HYBRID.pack`) lies under the rear seat (the bench moved forward over it, the sill opened in front of it), and the
 * HV run goes from the inverter down the firewall and along the sill's cut face to it (§ 5 Route through the section).
 * No planetary gearset (owner). Nothing here is orange unless a path is lit:
 *
 *  - the drive path (battery → HV run → inverter → windings; rotor → gears → hub), pulses flowing to the windings;
 *  - the regen path (hub → gears → rotor; windings → inverter; inverter → HV run → battery), the modules filling;
 *  - both with a `strength` (0 → 1): a thinner core, a dimmer glow, slower pulses, a smaller fill (the cold: ≈ 0.4).
 */
export const HYBRID = {
  /** The motor-generator's scale (x, y) round the final gear's centre (on the front axle). */
  mgScale: 0.8,
  /** The small pack under the rear seat. */
  pack: {pack: [-0.88, -0.36, 0.13, 0.335], z: 0.62, back: -0.62, modules: 6, moduleY: [0.165, 0.305]} as PackLayout,
  /** Where the sill starts (it stops short of the pack) and how far the rear bench moves forward over the pack. */
  sillFrom: -0.34,
  benchShift: 0.4,
  /** The tailpipe's tip (car frame), under the rear bumper on the near side. */
  tailpipe: [-2.36, 0.25, 0.48] as V3,
};

/** A point of the motor-generator in the electric car's drive-unit frame → the hybrid's (scaled round the final gear). */
export const mgPoint = ([x, y, z]: V3): V3 => {
  const [cx, cy] = EV.final.c;
  const k = HYBRID.mgScale;
  return [cx + k * (x - cx), cy + k * (y - cy), z];
};

/** The hybrid's drive legs (car frame), forward: battery → inverter, inverter → windings, rotor → hub. */
export const hybridDriveRoute = (hubZ: number): Record<'battery' | 'phase' | 'gears', V3[]> => {
  const ev = evDriveRoute(hubZ);
  const L = HYBRID.pack;
  const top = L.moduleY[1] + 0.012;
  const front = layoutModuleSpan(L, 0)[1] - 0.04;
  const invY = (EV.inverter[2] + EV.inverter[3]) / 2;
  return {
    battery: [
      [front, top, L.z + 0.025],
      [L.pack[1] + 0.04, 0.36, 0.83],
      [0.9, 0.36, 0.83],
      [1.0, 0.37, 0.5],
      mgPoint([1.0, 0.37, 0.275]),
      mgPoint([1.02, 0.86, 0.275]),
      mgPoint([1.16, invY, EV.inverter[5] + 0.025]),
    ],
    phase: ev.phase.map(mgPoint),
    gears: ev.gears.map(mgPoint),
  };
};

/** A named point of the hybrid's systems (car frame), for anchors: 'engine', 'motor', 'battery', 'inverter'. */
export const hybridPoint = (name: 'engine' | 'motor' | 'battery' | 'inverter'): V3 => {
  if (name === 'motor') return mgPoint([EV.motor[0], EV.motor[1], EV.motorZ]);
  if (name === 'inverter') return mgPoint([(EV.inverter[0] + EV.inverter[1]) / 2, EV.inverter[3], EV.inverter[5]]);
  if (name === 'battery') {
    const L = HYBRID.pack;
    return [(L.pack[0] + L.pack[1]) / 2, (L.pack[2] + L.pack[3]) / 2, L.z];
  }
  return [1.66, 0.62, 0.3];
};

/** The forward drive path (`SlicedCar` `drivePath` on 'hybrid'; `DrivePathKeys` plus `strength`). */
export type HybridDriveKeys = {
  at: number;
  inverterAt?: number;
  windingsAt?: number;
  rotorAt?: number;
  wheelAt?: number;
  drawFor?: number;
  pulses?: boolean;
  fadeAt?: number;
  fadeFor?: number;
  /** 0 → 1 (a constant or keys): a thinner core, a dimmer glow, slower pulses (the cold ≈ 0.4). Default 1. */
  strength?: Keyed;
};

/** The regen path (`SlicedCar` `regen` on 'hybrid'; `RegenKeys` plus `strength`). */
export type HybridRegenKeys = {
  at: number;
  rotorAt?: number;
  windingsAt?: number;
  inverterAt?: number;
  batteryAt?: number;
  fullAt?: number;
  fill?: number;
  brightAt?: number;
  fadeAt?: number;
  fadeFor?: number;
  /** 0 → 1 (a constant or keys): a thinner core, a dimmer glow, slower dots, a smaller fill (the cold ≈ 0.4). Default 1. */
  strength?: Keyed;
};

const driveState = (k: HybridDriveKeys | null | undefined, t: number) => {
  if (!k) return null;
  const s = k.drawFor === undefined ? 1 : Math.max(0.05, k.drawFor) / 4.2;
  const inverterAt = k.inverterAt ?? k.at + 1.2 * s;
  const windingsAt = k.windingsAt ?? inverterAt + 1.0 * s;
  const rotorAt = k.rotorAt ?? windingsAt + 0.2 * s;
  const wheelAt = k.wheelAt ?? rotorAt + 1.8 * s;
  return {
    battery: ease(t, k.at, inverterAt),
    phase: ease(t, inverterAt, windingsAt),
    coils: ease(t, windingsAt - 0.05 * s, windingsAt + 0.25 * s),
    gears: ease(t, rotorAt, wheelAt),
    glow: k.fadeAt == null ? 1 : 1 - ease(t, k.fadeAt, k.fadeAt + (k.fadeFor ?? 0.7)),
    started: t >= k.at,
    flowing: t >= windingsAt,
    strength: Math.max(0, Math.min(1, keyedValue(k.strength, t, 1))),
  };
};

const regenState = (k: HybridRegenKeys | null | undefined, t: number, modules: number) => {
  if (!k) return null;
  const rotorAt = k.rotorAt ?? k.at + 1.8;
  const windingsAt = k.windingsAt ?? rotorAt + 0.2;
  const inverterAt = k.inverterAt ?? windingsAt + 1.0;
  const batteryAt = k.batteryAt ?? inverterAt + 1.2;
  const fullAt = k.fullAt ?? batteryAt + 1.4;
  const strength = Math.max(0, Math.min(1, keyedValue(k.strength, t, 1)));
  const fill = (k.fill ?? 0.3) * strength;
  const span = Math.max(0.3, fullAt - batteryAt);
  return {
    a: ease(t, k.at, rotorAt),
    b: ease(t, windingsAt + 0.25, inverterAt),
    c: ease(t, inverterAt, batteryAt),
    coils: ease(t, windingsAt, windingsAt + 0.8),
    modules: [...Array(modules).keys()].map(
      (m) => fill * ease(t, batteryAt + (span * 0.75 * m) / modules, batteryAt + (span * 0.75 * m) / modules + span * 0.4),
    ),
    bright: k.brightAt == null ? 0 : ease(t, k.brightAt, k.brightAt + 0.4),
    glow: k.fadeAt == null ? 1 : 1 - ease(t, k.fadeAt, k.fadeAt + (k.fadeFor ?? 0.7)),
    started: t >= k.at,
    strength,
  };
};

/** The windings' glow (24 slots): a band leading (drive) or riding (regen) the magnets at low speed, steady once fast. */
const slotsFor = (amp: number, rotorSpin: number, rotorBlur: number, lead: number) =>
  [...Array(24).keys()].map((i) => {
    const a = ((i + 0.5) / 24) * Math.PI * 2;
    let b = 0;
    for (let k = 0; k < 8; k++) {
      const x = a - rotorSpin - lead - (k / 8) * Math.PI * 2;
      b = Math.max(b, Math.max(0, 1 - Math.abs(Math.atan2(Math.sin(x), Math.cos(x))) / 0.32) ** 1.4);
    }
    const fast = Math.max(0, Math.min(1, (Math.abs(rotorBlur) - 0.3) / 0.4));
    return amp * (b * (1 - fast) + 0.6 * fast);
  });

/** The pulses on the drive path's battery and phase legs together: this many, route-lengths a second at full strength. */
const PULSE = {n: 5, speed: 0.55};
/** A blip (a weak pulse that runs and dies on the HV run): how long it runs, how far it gets. */
const BLIP = {life: 1.1, reach: 0.55};
const HALO = {scale: 0.055 / 0.018, opacity: 0.25};

export type HybridSystemsProps = {
  mood: Mood;
  /** Seconds into the scene. */
  t: number;
  /** The near front wheel's turn in the car frame (rad), the rotor's turn and its blur. */
  wheelSpin: number;
  rotorSpin: number;
  rotorBlur: number;
  inkScale: number;
  /** The paths' core radius at this framing (the car's `pathR`). */
  pathR: number;
  /** Where the hub end of the drive path is (z: the whole near wheel's face). */
  hubZ: number;
  drive?: HybridDriveKeys | null;
  regen?: HybridRegenKeys | null;
  /** The pack's resting level (every module, orange: the charge it holds), 0 → 1, a constant or keys. Default 0. */
  packLevel?: Keyed;
  /** Weak pulses from the inverter toward the pack that die on the way (s into the scene). Default none. */
  blips?: number[];
  /** A node dot where the HV run meets the pack, 0 (off) → 1, a constant or keys. Default 0. */
  packNode?: Keyed;
};

/** The hybrid's motor-generator, pack and their lit paths (see the file comment). */
export const HybridSystems: React.FC<HybridSystemsProps> = ({
  mood,
  t,
  wheelSpin,
  rotorSpin,
  rotorBlur,
  inkScale,
  pathR,
  hubZ,
  drive,
  regen,
  packLevel,
  blips = [],
  packNode,
}) => {
  const route = useMemo(() => hybridDriveRoute(hubZ), [hubZ]);
  const L = HYBRID.pack;
  const d = driveState(drive, t);
  const r = regenState(regen, t, L.modules);
  const mats = useMemo(
    () => ({
      node: new THREE.MeshBasicMaterial({color: raw(section.orange), transparent: true}),
      pulseHalo: new THREE.MeshBasicMaterial({color: raw(section.orange), transparent: true, depthWrite: false, opacity: 0.5}),
      pulseCore: new THREE.MeshBasicMaterial({color: raw(section.orangeDot), transparent: true}),
    }),
    [],
  );
  const curves = useMemo(() => {
    const mk = (pts: V3[]) => new THREE.CatmullRomCurve3(pts.map((q) => new THREE.Vector3(...q)));
    return {battery: mk(route.battery), phase: mk(route.phase)};
  }, [route]);
  const lb = curves.battery.getLength();
  const lp = curves.phase.getLength();
  const along = (u: number): V3 => {
    const s = u * (lb + lp);
    const v = s < lb ? curves.battery.getPointAt(Math.min(0.999, s / lb)) : curves.phase.getPointAt(Math.min(0.999, (s - lb) / lp));
    return [v.x, v.y, v.z];
  };
  // strength → the core's radius (quantized: the tube rebuilds on change) and the glow
  const rOf = (s: number) => pathR * Math.round((0.45 + 0.55 * s) * 20) / 20;
  const gOf = (s: number) => 0.5 + 0.5 * s;
  // the windings: the push leads the magnets, the regen rides them
  const driveAmp = d && d.started ? d.coils * d.glow * gOf(d.strength) : 0;
  const regenAmp = r && r.started ? (0.6 + 0.4 * r.bright) * r.glow * r.coils * gOf(r.strength) : 0;
  const lead = Math.sign(rotorBlur || 1) * (Math.PI / 16);
  const slots = (() => {
    if (driveAmp <= 0.003 && regenAmp <= 0.003) return undefined;
    const ds = slotsFor(driveAmp, rotorSpin, rotorBlur, lead);
    const rs = slotsFor(regenAmp, rotorSpin, rotorBlur, 0);
    return ds.map((v, i) => Math.max(v, rs[i]));
  })();
  const base = Math.max(0, Math.min(1, keyedValue(packLevel, t, 0)));
  const fill = [...Array(L.modules).keys()].map((m) => Math.min(1, base + (r ? r.modules[m] * r.glow : 0)));
  const fillGlow = base > 0.004 || (r && r.started) ? 1 : 0;
  // drive pulses: slower and smaller with the strength
  const drivePulses =
    d && (drive?.pulses ?? true) && d.flowing && d.glow > 0.01
      ? [...Array(PULSE.n).keys()].map((i) => ({
          at: (((t * PULSE.speed * (0.35 + 0.65 * d.strength) + i / PULSE.n) % 1) + 1) % 1,
          k: d.glow * (0.6 + 0.4 * d.strength),
        }))
      : [];
  // blips: from the inverter back along the HV run, fading as they go
  const blipDots = blips.flatMap((b0) => {
    const age = t - b0;
    if (age < 0 || age > BLIP.life) return [];
    const u = (age / BLIP.life) * BLIP.reach;
    const v = curves.battery.getPointAt(Math.max(0.001, 1 - u));
    return [{p: [v.x, v.y, v.z] as V3, k: 0.7 * (1 - ease(age / BLIP.life, 0.4, 1))}];
  });
  const node = Math.max(0, Math.min(1, keyedValue(packNode, t, 0)));
  const dot = (p: V3, k: number, key: string) =>
    k > 0.01 ? (
      <mesh key={key} position={p} material={mats.node} userData={{glow: true}} scale={Math.max(0.35, k)}>
        <sphereGeometry args={[0.03 * (pathR / 0.0225), 16, 12]} />
      </mesh>
    ) : null;
  const pulse = (p: V3, k: number, key: string) => (
    <group key={key} position={p} scale={Math.max(0.001, k) * 0.8 * (pathR / 0.0225)}>
      <mesh material={mats.pulseHalo} userData={{glow: true}}>
        <sphereGeometry args={[0.085, 16, 12]} />
      </mesh>
      <mesh material={mats.pulseCore} userData={{glow: true}}>
        <sphereGeometry args={[0.045, 16, 12]} />
      </mesh>
    </group>
  );
  const rev = (pts: V3[]) => [...pts].reverse();
  const [cx, cy] = EV.final.c;
  const k = HYBRID.mgScale;
  return (
    <>
      {/* the motor-generator: the electric car's drive unit, smaller, round its final gear on the front axle */}
      <group position={[cx * (1 - k), cy * (1 - k), 0]} scale={[k, k, 1]}>
        <DriveUnit mood={mood} wheelSpin={wheelSpin} rotorSpin={rotorSpin} rotorBlur={rotorBlur} slots={slots} inkScale={inkScale} />
      </group>
      {/* the small pack under the rear seat, its levels (orange: the charge in it) */}
      <BatteryPack mood={mood} layout={L} fill={fill} glow={fillGlow} inkScale={inkScale} />
      {/* the drive path: battery → HV run → inverter → windings; rotor → gears → hub */}
      {d && d.started && d.glow > 0.01
        ? (
            [
              [route.battery, d.battery, true],
              [route.phase, d.phase, false],
              [route.gears, d.gears, true],
            ] as [V3[], number, boolean][]
          ).map(([leg, p, runner], i) =>
            p > 0 ? (
              <OrangePath
                key={`d${i}`}
                legs={[leg]}
                progress={p}
                glow={d.glow * gOf(d.strength)}
                stain={false}
                runner={runner && p < 1}
                radius={rOf(d.strength)}
                coreColor={section.orange}
                halo={HALO}
              />
            ) : null,
          )
        : null}
      {d && d.started && d.glow > 0.01
        ? [
            dot(route.battery[0], d.glow, 'db0'),
            dot(route.battery[route.battery.length - 1], d.battery >= 0.999 ? d.glow : 0, 'db1'),
            dot(route.gears[0], d.gears > 0 ? d.glow : 0, 'dg0'),
            dot(route.gears[route.gears.length - 1], d.gears >= 0.999 ? d.glow : 0, 'dg1'),
          ]
        : null}
      {drivePulses.map((q, i) => pulse(along(q.at), q.k, `dp${i}`))}
      {/* the regen path: hub → gears → rotor; windings → inverter; inverter → HV run → battery */}
      {r && r.started && r.glow > 0.01
        ? (
            [
              [rev(route.gears), r.a, true],
              [rev(route.phase), r.b, false],
              [rev(route.battery), r.c, false],
            ] as [V3[], number, boolean][]
          ).map(([leg, p, runner], i) =>
            p > 0 ? (
              <OrangePath
                key={`r${i}`}
                legs={[leg]}
                progress={p}
                glow={r.glow * gOf(r.strength)}
                stain={false}
                runner={runner && p < 1}
                radius={rOf(r.strength)}
                coreColor={section.orange}
                halo={HALO}
                flow={r.bright > 0.5 ? t * 0.6 * (0.35 + 0.65 * r.strength) : undefined}
                dots={3}
              />
            ) : null,
          )
        : null}
      {r && r.started && r.glow > 0.01
        ? [
            dot(route.gears[route.gears.length - 1], r.glow, 'rg0'),
            dot(route.gears[0], r.a >= 0.999 ? r.glow : 0, 'rg1'),
            dot(route.battery[route.battery.length - 1], r.b >= 0.999 ? r.glow : 0, 'rb0'),
            dot(route.battery[0], r.c >= 0.999 ? r.glow : 0, 'rb1'),
          ]
        : null}
      {node > 0.01 ? dot(route.battery[0], node, 'pn') : null}
      {blipDots.map((q, i) => pulse(q.p, q.k, `bl${i}`))}
    </>
  );
};
