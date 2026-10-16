import React, {useMemo} from 'react';
import * as THREE from 'three';
import {REAL} from '../../theme';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {raw} from '../plaster';
import {useFontsLoaded} from '../section/useFontsLoaded';
import {routerPrintTexture, routerVentTexture} from './phoneTextures';
import {applyEnv, useEnvStrength, useStudioEnv} from './useStudioEnv';

type V3 = [number, number, number];

const geos = new Map<string, THREE.BufferGeometry>();
/** The body: a properly smooth rounded box (cached by size). */
const bodyGeo = (w: number, h: number, d: number) => {
  const k = `${w}:${h}:${d}`;
  if (!geos.has(k)) geos.set(k, new RoundedBoxGeometry(w, h, d, 8, 0.035));
  return geos.get(k)!;
};

export type RealRouterProps = {
  /** Body centre. */
  position: V3;
  /** Body size (default the slice's 0.56 × 0.13 × 0.24). */
  size?: V3;
  /** The body's plastic colour (the mood's `appliance`). */
  color: string;
};

/**
 * A realistic, generic home router: satin plastic body with a clear-coat and soft edges, a vent
 * grille on the top, a printed band and status icons on the front (power, Wi-Fi, internet: neutral
 * dim LEDs, never orange: the system's LED is drawn by the slice at SLICE.led, so routes keep their anchor), two hinged rubber antennas, rubber
 * feet, ports and a reset hole on the right side. No maker, no logo.
 */
export const RealRouter: React.FC<RealRouterProps> = ({position, size = [0.56, 0.13, 0.24], color}) => {
  const env = useStudioEnv();
  const envScale = useEnvStrength();
  const ready = useFontsLoaded();
  const [w, h, d] = size;
  const mats = useMemo(() => {
    const phys = (o: THREE.MeshPhysicalMaterialParameters) => new THREE.MeshPhysicalMaterial(o);
    return {
      body: phys({roughness: 0.58, clearcoat: 0.15, clearcoatRoughness: 0.45}),
      rubber: phys({color: raw(REAL.rubber), roughness: 0.78, sheen: 0.4, sheenRoughness: 0.8}),
      hinge: phys({color: raw(REAL.rubber), roughness: 0.5, clearcoat: 0.3}),
      vent: new THREE.MeshStandardMaterial({transparent: true, roughness: 0.9, depthWrite: false}),
      print: new THREE.MeshStandardMaterial({transparent: true, roughness: 0.6, depthWrite: false}),
      port: new THREE.MeshStandardMaterial({color: raw('#16171a'), roughness: 0.6}),
      pin: new THREE.MeshStandardMaterial({color: raw(REAL.pad), roughness: 0.3, metalness: 1}),
      led: new THREE.MeshBasicMaterial({color: raw(REAL.statusLed)}),
      ledRing: new THREE.MeshStandardMaterial({color: raw('#2a2c30'), roughness: 0.4}),
    };
  }, []);
  mats.body.color.copy(raw(color));
  if (ready && !mats.vent.map) {
    mats.vent.map = routerVentTexture();
    mats.vent.needsUpdate = true;
    mats.print.map = routerPrintTexture();
    mats.print.needsUpdate = true;
  }
  applyEnv(
    env,
    [
      [mats.body, 0.3],
      [mats.rubber, 0.25],
      [mats.hinge, 0.5],
      [mats.pin, 1],
    ],
    envScale,
  );
  const fz = d / 2;
  return (
    <group position={position}>
      <mesh geometry={bodyGeo(w, h, d)} material={mats.body} castShadow receiveShadow />
      {/* top vent grille (printed recesses) */}
      <mesh position={[0, h / 2 + 0.0008, -0.01]} rotation={[-Math.PI / 2, 0, 0]} material={mats.vent}>
        <planeGeometry args={[w - 0.1, d - 0.08]} />
      </mesh>
      {/* front: a fine printed band and the status icons, with three neutral LEDs */}
      <mesh position={[-0.05, 0, fz + 0.0006]} material={mats.print}>
        <planeGeometry args={[w - 0.16, h - 0.04]} />
      </mesh>
      {[-0.16, -0.1, -0.04].map((x) => (
        <group key={x} position={[x, -0.022, fz + 0.0008]}>
          <mesh material={mats.ledRing}>
            <circleGeometry args={[0.0075, 16]} />
          </mesh>
          <mesh position={[0, 0, 0.0004]} material={mats.led}>
            <circleGeometry args={[0.0045, 16]} />
          </mesh>
        </group>
      ))}
      {/* right side: two ports, a USB port, the reset hole */}
      <group position={[w / 2 + 0.0008, -0.01, 0]} rotation={[0, Math.PI / 2, 0]}>
        {[-0.05, 0.0].map((z) => (
          <group key={z} position={[z, 0, 0]}>
            <mesh material={mats.port}>
              <planeGeometry args={[0.04, 0.034]} />
            </mesh>
            <mesh position={[0, 0.01, 0.0005]} material={mats.pin}>
              <planeGeometry args={[0.026, 0.004]} />
            </mesh>
          </group>
        ))}
        <mesh position={[0.05, 0, 0]} material={mats.port}>
          <planeGeometry args={[0.03, 0.012]} />
        </mesh>
        <mesh position={[0.085, 0, 0]} material={mats.port}>
          <circleGeometry args={[0.003, 10]} />
        </mesh>
      </group>
      {/* rubber feet */}
      {[-1, 1].flatMap((sx) =>
        [-1, 1].map((sz) => (
          <mesh
            key={`${sx}${sz}`}
            position={[sx * (w / 2 - 0.05), -h / 2 - 0.004, sz * (d / 2 - 0.04)]}
            material={mats.rubber}
          >
            <cylinderGeometry args={[0.014, 0.016, 0.008, 14]} />
          </mesh>
        )),
      )}
      {/* two hinged rubber antennas at the back corners, tilted a little outward */}
      {[-1, 1].map((sx) => (
        <group key={sx} position={[sx * (w / 2 - 0.06), h / 2 - 0.01, -d / 2 + 0.035]}>
          <mesh rotation={[0, 0, Math.PI / 2]} material={mats.hinge} castShadow>
            <cylinderGeometry args={[0.016, 0.016, 0.034, 16]} />
          </mesh>
          <group rotation={[0, 0, -sx * 0.1]}>
            <mesh position={[0, 0.03, 0]} material={mats.hinge} castShadow>
              <cylinderGeometry args={[0.011, 0.014, 0.04, 14]} />
            </mesh>
            <mesh position={[0, 0.22, 0]} material={mats.rubber} castShadow receiveShadow>
              <capsuleGeometry args={[0.0135, 0.32, 6, 16]} />
            </mesh>
            {[0.07, 0.085].map((y) => (
              <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]} material={mats.hinge}>
                <torusGeometry args={[0.0138, 0.0016, 6, 20]} />
              </mesh>
            ))}
          </group>
        </group>
      ))}
    </group>
  );
};
