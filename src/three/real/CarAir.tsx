import React, {useMemo} from 'react';
import {random} from 'remotion';
import * as THREE from 'three';
import {RACE, REAL, type Mood} from '../../theme';
import {raw} from '../plaster';
import {CurveArrow} from '../PushArrow';
import {SECTION_ANGLE} from '../section/SectionCamera';

type V3 = [number, number, number];

/*
 * No. 014 (`hybrid-city`): what a car does to the air, never orange (none of it is the system).
 *
 *  - `ExhaustPuffs` (N3): grey puffs at the tailpipe (`RACE.haze`), each a few soft blobs that swell, rise and drift
 *    back with the road, then fade; and the tailpipe's tip. Car frame (x forward), mounted inside the car's group.
 *  - `DragArrow` (N5): the air resistance as an ink arrow in front of the nose, pointing back into it, and three ink
 *    streamlines over the car with dashes flowing back. World frame (the arrows' flat heads face the camera).
 */

export type Puff = {i: number; age: number; size: number; back: number; u: number; op: number};

/** How many puffs can be in the air at once (materials are pooled). */
const POOL = 10;
/** Blobs per puff. */
const BLOBS = 4;

export const ExhaustPuffs: React.FC<{puffs: Puff[]; tailpipe: V3; mood: Mood; tip?: boolean}> = ({puffs, tailpipe, mood, tip = true}) => {
  const mats = useMemo(
    () => ({
      puff: [...Array(POOL).keys()].map(
        () => new THREE.MeshStandardMaterial({color: raw(RACE.haze), roughness: 1, transparent: true, depthWrite: false}),
      ),
      tip: new THREE.MeshPhysicalMaterial({color: raw(REAL.chrome), metalness: 0.9, roughness: 0.3}),
      bore: new THREE.MeshBasicMaterial({color: raw(REAL.labDark)}),
    }),
    [],
  );
  void mood;
  const [tx, ty, tz] = tailpipe;
  return (
    <>
      {tip ? (
        <group position={[tx + 0.04, ty, tz]} rotation={[0, 0, Math.PI / 2]}>
          <mesh material={mats.tip} castShadow>
            <cylinderGeometry args={[0.032, 0.032, 0.12, 16, 1, true]} />
          </mesh>
          <mesh material={mats.bore} position={[0, 0.058, 0]}>
            <circleGeometry args={[0.028, 16]} />
          </mesh>
        </group>
      ) : null}
      {puffs.map((p) => {
        const m = mats.puff[p.i % POOL];
        m.opacity = Math.max(0, Math.min(1, p.op));
        const r = p.size * (0.07 + 0.17 * Math.sqrt(p.u));
        return (
          <group key={p.i} position={[tx - 0.06 - p.back, ty + 0.03 + 0.22 * p.u * p.size, tz + 0.04 * p.u]}>
            {[...Array(BLOBS).keys()].map((j) => {
              const s = `puff-${p.i}-${j}`;
              const o: V3 = [
                (random(`${s}-x`) - 0.5) * r * 1.6 - j * r * 0.35,
                (random(`${s}-y`) - 0.3) * r * 1.1,
                (random(`${s}-z`) - 0.5) * r * 1.4,
              ];
              const k = 0.55 + 0.45 * random(`${s}-r`);
              return (
                <mesh key={j} material={m} position={o} scale={r * k} renderOrder={4}>
                  <sphereGeometry args={[1, 14, 10]} />
                </mesh>
              );
            })}
          </group>
        );
      })}
    </>
  );
};

export type DragArrowProps = {
  mood: Mood;
  /** Which way the car faces in the world: −1 (toward −x) or 1. */
  dir: number;
  /** The nose's front (car frame x), the arrow's height and its plane (z). */
  noseX: number;
  y: number;
  z: number;
  /** The arrow's length (m) and core radius; 0 → 1 strength (draw-on and fade). */
  length: number;
  radius: number;
  opacity: number;
  /** The streamlines (car frame (x, y) points), their plane (z), how far their dashes have flowed (route-lengths), their thickness. */
  streams?: [number, number][][];
  streamZ?: number;
  flow?: number;
  streamRadius?: number;
};

/** Dashes per streamline, and each dash's share of the line. */
const DASHES = 7;
const DASH = 0.075;

/** The air resistance: the ink arrow at the nose and the streamlines (see the file comment). */
export const DragArrow: React.FC<DragArrowProps> = ({
  mood,
  dir,
  noseX,
  y,
  z,
  length,
  radius,
  opacity,
  streams = [],
  streamZ = 0.2,
  flow = 0,
  streamRadius = 0.012,
}) => {
  const tip = noseX + 0.06;
  const pts: V3[] = [
    [dir * (tip + Math.max(0.05, length)), y, z],
    [dir * tip, y, z],
  ];
  const view = SECTION_ANGLE;
  return (
    <>
      {length > 0.02 ? (
        <CurveArrow points={pts} from={0} to={1} kind="ink" radius={radius} opacity={opacity} mood={mood} view={view} />
      ) : null}
      {streams.map((line, li) => {
        const world: V3[] = line.map(([x, yy]) => [dir * x, yy, streamZ]);
        return [...Array(DASHES).keys()].map((k) => {
          const u = ((((flow + k / DASHES + li * 0.31) % 1) + 1) % 1) * (1 + DASH) - DASH;
          const a = Math.max(0, u);
          const b = Math.min(1, u + DASH);
          if (b - a < 0.01) return null;
          // fade in at the front and out at the back, so dashes don't pop
          const edge = Math.min(1, a / 0.08, (1 - b) / 0.08);
          return (
            <CurveArrow
              key={`${li}-${k}`}
              points={world}
              from={a}
              to={b}
              kind="ink"
              radius={streamRadius}
              opacity={opacity * Math.max(0, edge)}
              mood={mood}
              view={view}
            />
          );
        });
      })}
    </>
  );
};
