import React, {useMemo} from 'react';
import * as THREE from 'three';
import {section} from '../../theme';
import {OrangePath} from '../OrangePath';
import {roundedBox} from '../plaster';
import type {ShellProfile} from './CarShell';
import {BLADE, EV, EV_BOARD} from './EvDrive';
import {circleXY, clipPolylineX, GlowEdge, GlowShell, madeByState, rectXY, type MadeByKeys} from './madeBy';
import {cutCarLamps, cutCarOutlines} from './RealCar';

type V3 = [number, number, number];

/*
 * No. 011 (N2): the "made by" glow on a cut car's part groups (style guide v0.14 § 5), in the car's own frame (x
 * forward; `SlicedCar` mounts it inside its mirrored group). Each group lights with its ink cut-edge line turned
 * orange (a tube over the ink) and an orange halo shell round it, both bloomed; the parts keep their materials and the
 * cut faces stay `cut`. Groups: the pack, the drive unit (motor), the inverter (with a short system path to the motor
 * and pulses along it), the body panels (the body's cut-edge outline split panel by panel, nose to tail, lit in
 * turn), the lamp housings (outlined, not lit lamps).
 */

/** The groups' keys (`SlicedCar` `madeBy`). Times are seconds into the scene. */
export type SlicedCarMadeBy = {
  /** The battery pack (its cut edge and a halo round it). */
  pack?: MadeByKeys;
  /** The drive unit's motor (the stator case's cut edge, a halo round the unit). Its rotor turns with the wheels (`driving`). */
  driveUnit?: MadeByKeys;
  /**
   * The inverter on the drive unit (outlined, a halo). With the drive unit lit too, a short system path joins it to the
   * motor; `pulses` send orange pulses down it from `at` every `every` s (default 0.3) until `until`.
   */
  inverter?: MadeByKeys & {pulses?: {at: number; every?: number; until?: number}};
  /**
   * The body panels: the body's cut-edge outline split into front (bumper, fender), front door, rear door, rear
   * (quarter, trunk), lit in turn from `at`, `stagger` s apart (default 0.25), 'nose' to tail (default) or 'tail' first.
   */
  panels?: MadeByKeys & {stagger?: number; order?: 'nose' | 'tail'};
  /** The lamp housings: head lamps first, then the tail lamps, `stagger` s apart (default 0.15). */
  lamps?: MadeByKeys & {stagger?: number};
  /** Surges on every lit group (added to each group's own). */
  surge?: number[];
  /** Every group fades from here (0.5 s), unless a group sets its own. */
  fadeAt?: number;
};

/** The inverter's phase run down to the motor (car frame; as the No. 008 drive path's phase leg). */
const LINK: V3[] = [
  [EV_BOARD[0] + 0.08, EV_BOARD[2] + 0.01, EV.inverter[5] + 0.03],
  [1.265, 0.84, EV.motorZ + 0.03],
  [EV.motor[0] + 0.05, EV.motor[1] + 0.12, EV.motorZ + 0.03],
];
/** The panels' x ranges (car frame), nose to tail. */
const PANELS: [number, number][] = [
  [0.95, 9],
  [-0.05, 0.95],
  [-1.05, -0.05],
  [-9, -1.05],
];

const motorShell = (() => {
  let g: THREE.BufferGeometry | null = null;
  return () => {
    if (g) return g;
    g = new THREE.CylinderGeometry(EV.caseR, EV.caseR, EV.motorZ + 0.24, 32);
    g.rotateX(Math.PI / 2);
    return g;
  };
})();

export type MadeByCarProps = {
  madeBy: SlicedCarMadeBy;
  t: number;
  /** The core radius (m, `madeByCoreR` for the camera distance). */
  r: number;
  shape?: ShellProfile;
  ev: boolean;
  gas?: boolean;
  /** The brake lamps are drawn (the near tail lamp and the high-mount lamp exist). */
  brake: boolean;
  /** The pack's top (m): the blade pack's lid as it rises; default `EV.pack`'s. */
  packTop?: number;
  /** The radius of the system path (the link inverter → motor). */
  pathR: number;
};

/** The glow overlays (see the file comment). */
export const MadeByCar: React.FC<MadeByCarProps> = ({madeBy, t, r, shape, ev, gas, brake, packTop, pathR}) => {
  const mb = madeBy;
  const keys = (k: MadeByKeys | undefined, shift = 0): MadeByKeys | undefined =>
    k ? {at: k.at + shift, surge: [...(k.surge ?? []), ...(mb.surge ?? [])], fadeAt: k.fadeAt ?? mb.fadeAt} : undefined;
  const outlines = useMemo(() => cutCarOutlines({shape, ev, gas}), [shape, ev, gas]);
  const panelLines = useMemo(() => PANELS.map(([a, b]) => outlines.flatMap((o) => clipPolylineX(o, a, b))), [outlines]);
  const lamps = useMemo(() => cutCarLamps(shape, brake), [shape, brake]);
  const [x0, x1, y0, y1] = EV.pack;
  const top = packTop ?? y1;
  const zc = EV.packZ;
  const zb = EV.packBack;
  const pack = madeByState(keys(mb.pack), t);
  const du = madeByState(keys(mb.driveUnit), t);
  const inv = madeByState(keys(mb.inverter), t);
  const packBox = useMemo(() => roundedBox(x1 - x0, 1, zc - zb, 0.01, 2), [x0, x1, zc, zb]);
  const invBox = useMemo(() => {
    const [a, b, c, d, e, f] = EV.inverter;
    return {g: roundedBox(b - a, d - c, f - e, 0.012, 2), at: [(a + b) / 2, (c + d) / 2, (e + f) / 2] as V3};
  }, []);
  // the link and its pulses (only while both ends are lit)
  const link = Math.min(du.lit, inv.lit);
  const linkCurve = useMemo(() => new THREE.CatmullRomCurve3(LINK.map((p) => new THREE.Vector3(...p))), []);
  const pz = mb.inverter?.pulses;
  const every = Math.max(0.1, pz?.every ?? 0.3);
  const pulses: V3[] = [];
  if (pz && link > 0.05)
    for (let j = 0; j < 4; j++) {
      const n = Math.floor((t - pz.at) / every) - j;
      const at = pz.at + n * every;
      const age = t - at;
      if (n < 0 || age < 0 || age > 0.45 || at > (pz.until ?? Infinity)) continue;
      const v = linkCurve.getPointAt(Math.min(0.999, age / 0.45));
      pulses.push([v.x, v.y, v.z]);
    }
  const order = mb.panels?.order === 'tail' ? [3, 2, 1, 0] : [0, 1, 2, 3];
  const lampStagger = mb.lamps?.stagger ?? 0.15;
  return (
    <group>
      {mb.pack ? (
        <group>
          <GlowEdge lines={[rectXY(x0, x1, y0, top, zc + 0.004)]} lit={pack.lit} surge={pack.surge} r={r} />
          <GlowShell
            geometry={packBox}
            lit={pack.lit}
            surge={pack.surge}
            r={r}
            position={[(x0 + x1) / 2, (y0 + top) / 2, (zc + zb) / 2]}
            scale={[1, top - y0, 1]}
          />
        </group>
      ) : null}
      {mb.driveUnit ? (
        <group>
          <GlowEdge lines={[circleXY(EV.motor[0], EV.motor[1], EV.caseR, EV.motorZ + 0.006)]} lit={du.lit} surge={du.surge} r={r} />
          <GlowShell geometry={motorShell()} lit={du.lit} surge={du.surge} r={r} position={[EV.motor[0], EV.motor[1], (EV.motorZ - 0.24) / 2]} />
        </group>
      ) : null}
      {mb.inverter ? (
        <GlowShell geometry={invBox.g} lit={inv.lit} surge={inv.surge} r={r} core position={invBox.at} />
      ) : null}
      {link > 0.01 ? (
        <OrangePath
          legs={[LINK]}
          progress={1}
          glow={link}
          stain={false}
          runner={false}
          radius={pathR}
          coreColor={section.orange}
          halo={{scale: 0.055 / 0.018, opacity: 0.25}}
        />
      ) : null}
      {pulses.map((p, i) => (
        <mesh key={i} position={p} userData={{glow: true}}>
          <sphereGeometry args={[pathR * 2.2, 14, 10]} />
          <meshBasicMaterial color={section.orange} />
        </mesh>
      ))}
      {mb.panels
        ? order.map((pi, step) => {
            const st = madeByState(keys(mb.panels, step * (mb.panels!.stagger ?? 0.25)), t);
            return <GlowEdge key={pi} lines={panelLines[pi]} closed={false} lit={st.lit} surge={st.surge} r={r} />;
          })
        : null}
      {mb.lamps
        ? lamps.map((l, i) => {
            const st = madeByState(keys(mb.lamps, (l.kind === 'head' ? 0 : 1) * lampStagger * 2 + (i % 2) * lampStagger), t);
            return (
              <GlowShell key={i} geometry={roundedBox(l.size[0] + 0.01, l.size[1] + 0.01, l.size[2] + 0.01, 0.005, 2)} lit={st.lit} surge={st.surge} r={r} core position={l.at} />
            );
          })
        : null}
    </group>
  );
};

/** The blade pack's lid top (m) for a lid rise 0 → 1 (`BladeState.lid`). */
export const bladeLidTop = (lid: number) => BLADE.lidFrom + (BLADE.lidTo - BLADE.lidFrom) * Math.max(0, Math.min(1, lid));
