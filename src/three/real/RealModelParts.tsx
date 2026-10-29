import React, {useMemo} from 'react';
import * as THREE from 'three';
import {realFaceBoxes, type FaceBox, type RealShape} from './realModels';

/**
 * The real models' face cues on a cut car (No. 011, style guide v0.15 § 3; `realModels.ts` `realFaceBoxes`): the
 * headlamps (the light lens), the tail lamps (the tail lens, lit with the running and brake lamps, flat, never
 * bloomed), the high-mount lamp, the Model 3's thin lower slot and the Seal 06's lower trapezoidal intake (dark
 * trim). Car frame. No logo, badge, lettering or plate.
 */
export const RealModelParts: React.FC<{
  shape: RealShape;
  /** The nose sectioned at the firewall's plane (an open bay): no near headlamp. */
  bay: boolean;
  /** The brake lamps drawn: the near tail lamp and the high-mount lamp. */
  brake: boolean;
  mats: {light: THREE.Material; tail: THREE.Material; tailBright: THREE.Material; trim: THREE.Material};
}> = ({shape, bay, brake, mats}) => {
  const boxes = useMemo(() => realFaceBoxes(shape, {bay, brake}), [shape, bay, brake]);
  return (
    <>
      {boxes.map((b, i) =>
        b.kind === 'intake' ? (
          <Trapezoid key={i} box={b} material={mats.trim} />
        ) : (
          <mesh key={i} position={b.at} rotation={[0, 0, b.rot]} material={b.kind === 'head' ? mats.light : b.kind === 'high' ? mats.tailBright : b.kind === 'tail' ? mats.tail : mats.trim}>
            <boxGeometry args={b.size} />
          </mesh>
        ),
      )}
    </>
  );
};

/** The intake's taper: the top edge this much narrower each side than the bottom (m). */
const TAPER = 0.14;

/** A trapezoid laid on the face (wider at the bottom), clipped where the box was (the bay's section plane). */
const Trapezoid: React.FC<{box: FaceBox; material: THREE.Material}> = ({box, material}) => {
  const geo = useMemo(() => {
    const [d, h, w] = box.size;
    const zc = box.at[2];
    // the full trapezoid is symmetric about z 0; the box may be clipped on its near side
    const half = Math.max(Math.abs(zc - w / 2), Math.abs(zc + w / 2));
    const zMax = zc + w / 2;
    const zMin = zc - w / 2;
    const raw: [number, number][] = [
      [-half, -h / 2],
      [half, -h / 2],
      [half - TAPER, h / 2],
      [-(half - TAPER), h / 2],
    ];
    const pts = raw.map(([z, y]) => [Math.max(zMin, Math.min(zMax, z)), y] as [number, number]);
    const g = new THREE.ExtrudeGeometry(new THREE.Shape(pts.map(([z, y]) => new THREE.Vector2(z, y))), {depth: d, bevelEnabled: false});
    g.translate(0, 0, -d / 2);
    // shape x → car z, extrusion → car −x (symmetric about the face's centre)
    g.rotateY(-Math.PI / 2);
    return g;
  }, [box]);
  return <mesh geometry={geo} position={[box.at[0], box.at[1], 0]} rotation={[0, 0, box.rot]} material={material} />;
};
