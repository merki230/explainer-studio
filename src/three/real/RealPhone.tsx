import React, {useMemo} from 'react';
import * as THREE from 'three';
import {REAL} from '../../theme';
import {raw, roundedBox} from '../plaster';
import {cutMaterial, INK} from '../section/cutLook';
import {section} from '../../theme';
import {glassStreakTexture, grilleTexture} from './phoneTextures';
import {roundedPlane, roundedRingPlane, roundedSlab} from './shapes';
import {applyAlbedo, applyEnv, useAlbedo, useEnvStrength, useStudioEnv} from './useStudioEnv';

type V3 = [number, number, number];

/**
 * The realistic phone's own dimensions (phone units; ≈ 12.7 units to the metre at scale 1, so a
 * 73 × 150 × 8.6 mm phone): width, height, depth, corner radius, frame wall.
 */
export const REAL_PHONE = {w: 0.93, h: 1.9, d: 0.11, r: 0.135, t: 0.028};
const P = REAL_PHONE;
/** Front glass (inset from the frame's outline) and the display's active area under it. */
const GLASS = {w: P.w - 0.014, h: P.h - 0.014, r: P.r - 0.007, depth: 0.008};
export const REAL_DISPLAY = {w: P.w - 0.07, h: P.h - 0.07, r: P.r - 0.035};
/** Front of the frame (the section cut when the front comes off) and front of the glass. */
export const REAL_FRONT = P.d / 2;
const GLASS_FRONT = REAL_FRONT + GLASS.depth - 0.002;

export type RealPhoneProps = {
  position?: V3;
  rotation?: V3;
  /** Uniform scale of the whole phone (1: the section-model size, 1.9 units tall). */
  scale?: number;
  /**
   * The display's material (the caller draws the UI, e.g. with screenKit's `drawScreenFit`, on a
   * canvas of the display's shape, 1 : 2.11). Omit for a dark screen.
   */
  display?: THREE.Material;
  /** 0: closed; 1: the front (glass and display) has slid off toward the viewer and gone. */
  open?: number;
  /** When open, the frame's front rim shows as a cut face: hatched, with ink on both edges (default true). */
  section?: boolean;
  /**
   * A small shutter in the top edge (the diagrams' "door to the network"): 0 shut, 1 slid open
   * onto a dark slot. Omit for no shutter.
   */
  shutter?: number;
  /** Where the shutter sits along the top edge (x, phone units; default 0, the middle). */
  shutterX?: number;
  /** Cast and receive shadows (default true). */
  shadows?: boolean;
  /** What sits inside the frame (the teardown), in the phone's local units: front at +z = REAL_FRONT. */
  children?: React.ReactNode;
};

/**
 * A realistic modern phone, built in code and generic (no logos, no real brand shapes): a rounded
 * aluminium frame with soft bevels, antenna bands and side buttons; black front glass with a
 * clear-coat and the live screen under it, a punch-hole camera and the earpiece slot; a frosted back
 * with a glossy camera bump (three lenses with glass rings, flash, mic); speaker grille and port on
 * the bottom edge. Reflections come from the studio HDRI (loaded once; the frame waits for it).
 * Screen on the +z face. Centred on its own middle.
 */
export const RealPhone: React.FC<RealPhoneProps> = ({
  position,
  rotation,
  scale = 1,
  display,
  open = 0,
  section: showCut = true,
  shadows = true,
  shutter,
  shutterX = 0,
  children,
}) => {
  const env = useStudioEnv();
  const envScale = useEnvStrength();
  const albedo = useAlbedo();
  const mats = useMemo(() => {
    const phys = (o: THREE.MeshPhysicalMaterialParameters) => new THREE.MeshPhysicalMaterial(o);
    return {
      frame: phys({color: raw(REAL.frame), metalness: 1, roughness: 0.45}),
      antenna: phys({color: raw(REAL.antenna), metalness: 0, roughness: 0.55}),
      glass: phys({
        color: raw(REAL.glass),
        metalness: 0,
        roughness: 0.08,
        clearcoat: 1,
        clearcoatRoughness: 0.03,
        transparent: true,
      }),
      // reflections on the screen area only: black dielectric, added on top of the display
      sheen: phys({
        color: 0x000000,
        metalness: 0,
        roughness: 0.04,
        clearcoat: 1,
        clearcoatRoughness: 0.02,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
      back: phys({color: raw(REAL.back), metalness: 0, roughness: 0.42, clearcoat: 0.6, clearcoatRoughness: 0.5}),
      bump: phys({color: raw(REAL.back), metalness: 0, roughness: 0.16, clearcoat: 0.6, clearcoatRoughness: 0.2}),
      lens: phys({color: raw(REAL.lens), metalness: 0.2, roughness: 0.02, clearcoat: 1, clearcoatRoughness: 0}),
      lensRing: phys({color: raw(REAL.lensRing), metalness: 0.6, roughness: 0.3}),
      flash: phys({color: raw(REAL.flash), metalness: 0, roughness: 0.35, clearcoat: 1}),
      streak: new THREE.MeshBasicMaterial({
        map: glassStreakTexture(),
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
      hole: new THREE.MeshBasicMaterial({color: raw('#050506')}),
      panel: new THREE.MeshBasicMaterial({color: raw(REAL.panelOff), transparent: true}),
      grille: new THREE.MeshStandardMaterial({map: grilleTexture(), roughness: 0.6}),
      cut: cutMaterial(),
      ink: new THREE.MeshBasicMaterial({color: raw(section.cutLine)}),
    };
  }, []);
  applyEnv(
    env,
    [
      [mats.frame, 1.3],
      [mats.antenna, 0.6],
      [mats.glass, 1.1],
      [mats.sheen, 3.0 * (1 - open)],
      [mats.back, 0.9],
      [mats.bump, 0.85],
      [mats.lens, 1.1],
      [mats.lensRing, 1.2],
      [mats.flash, 0.8],
      [mats.grille, 0.4],
    ],
    envScale,
  );
  // fixed colours scale with the mood; the cut face and its ink keep the house values
  applyAlbedo(
    Object.entries(mats).flatMap(([k, v]) => (k === 'cut' || k === 'ink' || k === 'sheen' ? [] : [v])),
    albedo,
  );
  const fade = 1 - open;
  mats.glass.opacity = fade;
  mats.panel.opacity = fade;
  // the screen goes dark first (the first third of the move), then the glass lifts away
  const screenFade = Math.max(0, 1 - open * 3);
  mats.streak.opacity = 0.4 * fade;
  if (display) {
    display.transparent = true;
    display.opacity = screenFade;
  }

  const cs = shadows;
  const half = {x: P.w / 2, y: P.h / 2, z: P.d / 2};
  const flat = P.d - 0.03; // the frame's flat side band (between the bevels)
  const lift = open * 0.6;

  // antenna bands: thin plastic breaks across the frame (two on each long side, one on each end)
  const bands: {p: V3; s: V3}[] = [
    ...[-1, 1].flatMap((sx) =>
      [-0.72, 0.72].map((y) => ({p: [sx * (half.x - P.t / 2 + 0.0008), y, 0] as V3, s: [P.t, 0.012, flat] as V3})),
    ),
    ...[-1, 1].map((sy) => ({p: [0.26, sy * (half.y - P.t / 2 + 0.0008), 0] as V3, s: [0.012, P.t, flat] as V3})),
  ];
  // side buttons: power on the right (+x), volume and the action key on the left (−x)
  const buttons: {x: number; y: number; len: number}[] = [
    {x: 1, y: 0.36, len: 0.22},
    {x: -1, y: 0.56, len: 0.15},
    {x: -1, y: 0.37, len: 0.15},
    {x: -1, y: 0.76, len: 0.07},
  ];
  // camera island on the back, top corner on the +x side (top-left seen from behind): one tall
  // rounded strip holding two lenses and the flash, with the mic beside it (a generic layout, no
  // maker's signature shape)
  const BUMP = {x: half.x - 0.165, y: half.y - 0.34, w: 0.2, h: 0.53, r: 0.1};
  const lenses: [number, number][] = [
    [0, 0.165],
    [0, -0.005],
  ];

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* the frame: a rounded ring with soft bevels, open front and back */}
      <mesh
        geometry={roundedSlab(P.w, P.h, P.d, P.r, 0.014, P.t)}
        material={mats.frame}
        position={[0, 0, -half.z]}
        castShadow={cs}
        receiveShadow={cs}
      />
      {bands.map((b, i) => (
        <mesh key={i} position={b.p} material={mats.antenna}>
          <boxGeometry args={b.s} />
        </mesh>
      ))}
      {buttons.map((b, i) => (
        <mesh
          key={i}
          geometry={roundedSlab(0.03, b.len, 0.016, 0.008, 0.006)}
          material={mats.frame}
          position={[b.x * (half.x - 0.004), b.y, 0]}
          rotation={[0, (b.x * Math.PI) / 2, 0]}
          castShadow={cs}
        />
      ))}
      {/* bottom edge: speaker grille holes either side of the port; top edge: a mic hole */}
      <group position={[0, -half.y - 0.0006, 0]} rotation={[Math.PI / 2, 0, 0]}>
        {[-1, 1].flatMap((s) =>
          [0, 1, 2, 3, 4, 5].map((i) => (
            <mesh key={`${s}${i}`} position={[s * (0.13 + i * 0.03), 0, 0]} material={mats.hole}>
              <circleGeometry args={[0.0085, 14]} />
            </mesh>
          )),
        )}
        <mesh geometry={roundedPlane(0.1, 0.034, 0.017)} material={mats.hole} />
      </group>
      <mesh position={[-0.18, half.y + 0.0006, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mats.hole}>
        <circleGeometry args={[0.007, 12]} />
      </mesh>

      {shutter !== undefined ? (
        <group position={[shutterX, half.y, 0]}>
          {/* the slot (dark) and the shutter plate sliding along the edge */}
          <mesh position={[0, 0.0008, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mats.hole}>
            <planeGeometry args={[0.22, 0.042]} />
          </mesh>
          <mesh
            geometry={roundedBox(0.2, 0.01, 0.05, 0.004)}
            material={mats.frame}
            position={[0.215 * Math.max(0, Math.min(1, shutter)), 0.005, 0]}
            castShadow={cs}
          />
          {[-1, 1].map((sx) => (
            <mesh key={sx} position={[sx * 0.075, 0.0102, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mats.antenna}>
              <planeGeometry args={[0.004, 0.036]} />
            </mesh>
          ))}
        </group>
      ) : null}

      {/* the back: frosted glass, flush with the frame */}
      <mesh
        geometry={roundedSlab(P.w - 0.02, P.h - 0.02, 0.008, P.r - 0.01, 0.003)}
        material={mats.back}
        position={[0, 0, -half.z + 0.002]}
        castShadow={cs}
        receiveShadow={cs}
      />
      {/* the camera bump: glossy glass plateau, three lenses (metal ring, glass, inner rings), flash, mic */}
      <group position={[BUMP.x, BUMP.y, -half.z + 0.002]} rotation={[0, Math.PI, 0]}>
        <mesh geometry={roundedSlab(BUMP.w, BUMP.h, 0.018, BUMP.r, 0.007)} material={mats.bump} castShadow={cs} />
        {lenses.map(([lx, ly], i) => (
          <group key={i} position={[lx, ly, 0.018]}>
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.007]} material={mats.frame} castShadow={cs}>
              <cylinderGeometry args={[0.07, 0.072, 0.014, 40]} />
            </mesh>
            <mesh position={[0, 0, 0.0145]} material={mats.lens}>
              <circleGeometry args={[0.06, 40]} />
            </mesh>
            {[0.052, 0.036, 0.02].map((rr, j) => (
              <mesh key={j} position={[0, 0, 0.0148 + j * 0.0002]} material={mats.lensRing}>
                <ringGeometry args={[rr - 0.0035, rr, 40]} />
              </mesh>
            ))}
            <mesh position={[0, 0, 0.0152]} material={mats.lens}>
              <circleGeometry args={[0.012, 24]} />
            </mesh>
          </group>
        ))}
        <mesh position={[0, -0.16, 0.0185]} material={mats.flash}>
          <circleGeometry args={[0.03, 28]} />
        </mesh>
        <mesh position={[0.17, 0.18, 0.0008]} material={mats.hole}>
          <circleGeometry args={[0.007, 12]} />
        </mesh>
      </group>

      {/* inside (the teardown) */}
      {children}

      {/* the cut: the frame's front rim, hatched, ink on its outer and inner edges (only once open) */}
      {showCut && open > 0.02 ? (
        <group position={[0, 0, REAL_FRONT + 0.0006]}>
          <mesh geometry={roundedRingPlane(P.w, P.h, P.r, P.t)} material={mats.cut} receiveShadow={cs} />
          <mesh
            geometry={roundedRingPlane(P.w + INK / 2, P.h + INK / 2, P.r + INK / 4, INK)}
            material={mats.ink}
            position={[0, 0, 0.0005]}
          />
          <mesh
            geometry={roundedRingPlane(P.w - 2 * P.t + INK / 2, P.h - 2 * P.t + INK / 2, P.r - P.t + INK / 4, INK)}
            material={mats.ink}
            position={[0, 0, 0.0005]}
          />
        </group>
      ) : null}

      {/* the front: black glass, the display under it, the punch-hole and earpiece; slides off when opening */}
      <group position={[0, 0, lift]} visible={open < 0.99}>
        <mesh
          geometry={roundedSlab(GLASS.w, GLASS.h, GLASS.depth, GLASS.r, 0.0035)}
          material={mats.glass}
          position={[0, 0, REAL_FRONT - 0.002]}
          castShadow={cs}
        />
        <mesh
          geometry={roundedPlane(REAL_DISPLAY.w, REAL_DISPLAY.h, REAL_DISPLAY.r)}
          material={display ?? mats.panel}
          position={[0, 0, GLASS_FRONT + 0.0008]}
        />
        <mesh position={[0, REAL_DISPLAY.h / 2 - 0.055, GLASS_FRONT + 0.0014]} material={mats.hole}>
          <circleGeometry args={[0.021, 28]} />
        </mesh>
        <mesh
          geometry={roundedPlane(0.17, 0.007, 0.0035)}
          material={mats.hole}
          position={[0, GLASS.h / 2 - 0.012, GLASS_FRONT + 0.0006]}
        />
        <mesh
          geometry={roundedPlane(GLASS.w - 0.008, GLASS.h - 0.008, GLASS.r - 0.004)}
          material={mats.sheen}
          position={[0, 0, GLASS_FRONT + 0.002]}
        />
        <mesh
          geometry={roundedPlane(GLASS.w - 0.008, GLASS.h - 0.008, GLASS.r - 0.004)}
          material={mats.streak}
          position={[0, 0, GLASS_FRONT + 0.0026]}
        />
      </group>
    </group>
  );
};
