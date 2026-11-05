import React, {useMemo} from 'react';
import * as THREE from 'three';
import {CHARGE} from '../../theme';
import {raw, roundedBox} from '../plaster';
import type {ShellProfile} from './CarShell';

type V3 = [number, number, number];

/**
 * How much lower the roof is than the crossover's (m), per whole-car shape (`CarShell`): the sedan's peak sits ≈ 1.62
 * against the crossover's 1.77; the hatch's ≈ 1.70; the coupe's ≈ 1.46.
 */
const ROOF_DROP: Partial<Record<ShellProfile, number>> = {sedan: 0.15, hatch: 0.07, coupe: 0.31, model3: 0.15, seal06: 0.15};

/** The rack's layout on the crossover's roof (car-local metres: x forward, y up, z right). */
export const RACK = {
  /** The side rails' ends along the roof, their half-spacing across, their top. */
  railX: [0.1, -1.9] as [number, number],
  railZ: 0.6,
  railTop: 1.845,
  /** The two crossbars' places along the roof and their half-length. */
  barX: [-0.32, -1.42] as [number, number],
  barHalf: 0.69,
  barTop: 1.875,
};

/** The rack's bounding corners (car-local), for the camera-view box and the plate camera's marks. */
export const rackBounds = (shape: ShellProfile = 'crossover'): [V3, V3] => {
  const dy = -(ROOF_DROP[shape] ?? 0);
  return [
    [RACK.railX[1] - 0.03, RACK.railTop - 0.08 + dy, -RACK.barHalf],
    [RACK.railX[0] + 0.03, RACK.barTop + dy, RACK.barHalf],
  ];
};

/**
 * A roof rack on a whole car (No. 015 N2): two side rails on feet and two crossbars, matte dark powder-coated metal
 * (`CHARGE.cabinetDark`, roughness 0.6, metalness 0.3; brand-director ruling v0.18.7), real thickness, no logo, text or
 * end caps. Car-local (put it inside the car's group). Every part has depth: the feet sink into the roof (hidden by it),
 * the bars sit 5 mm into the rails, so no two faces lie in one plane.
 */
export const RoofRack: React.FC<{shape?: ShellProfile}> = ({shape = 'crossover'}) => {
  const mat = useMemo(() => new THREE.MeshStandardMaterial({color: raw(CHARGE.cabinetDark), roughness: 0.6, metalness: 0.3}), []);
  const geo = useMemo(() => {
    const railL = RACK.railX[0] - RACK.railX[1];
    return {
      rail: roundedBox(railL, 0.035, 0.05, 0.012, 3),
      bar: roundedBox(0.06, 0.035, 2 * RACK.barHalf, 0.012, 3),
      foot: roundedBox(0.09, 0.12, 0.055, 0.015, 2),
    };
  }, []);
  const dy = -(ROOF_DROP[shape] ?? 0);
  const railY = RACK.railTop - 0.0175 + dy;
  const barY = RACK.barTop - 0.0175 + dy;
  const midX = (RACK.railX[0] + RACK.railX[1]) / 2;
  // the feet: from just under the rail down into the roof (the roof hides their lower part)
  const feet = [RACK.railX[0] - 0.06, -0.62, -1.24, RACK.railX[1] + 0.06];
  return (
    <group>
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh geometry={geo.rail} material={mat} position={[midX, railY, s * RACK.railZ]} castShadow receiveShadow />
          {feet.map((x) => (
            <mesh key={x} geometry={geo.foot} material={mat} position={[x, railY - 0.07, s * RACK.railZ]} castShadow />
          ))}
        </group>
      ))}
      {RACK.barX.map((x) => (
        <mesh key={x} geometry={geo.bar} material={mat} position={[x, barY - 0.005, 0]} castShadow receiveShadow />
      ))}
    </group>
  );
};
