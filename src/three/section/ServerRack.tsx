import React, {useEffect, useMemo} from 'react';
import {random} from 'remotion';
import * as THREE from 'three';
import {REAL, section} from '../../theme';
import {raw, roundedBox} from '../plaster';
import {applyAlbedo, applyEnv, useAlbedo, useEnvStrength, useStudioEnv} from '../real/useStudioEnv';
import {CutOutline, cutMaterial, INK, type Rect} from './cutLook';

type V3 = [number, number, number];

/*
 * A server rack for a data-hall slice (No. 013), realistic and generic (no maker, no logo, nothing readable), in metres:
 * a 42U steel cabinet with a perforated front door frame, rows of 1U/2U servers with dark bezels, vent slots and neutral
 * status LEDs blinking on the video clock, and at the back a column of fans per server. Two variants:
 *  - 'standard': an ordinary rack, ≈ 2/3 full (blank panels in the gaps), single PDU.
 *  - 'ai': an AI rack, every unit filled with dense 2U GPU servers, more fans, two coolant hoses (manifold at the back,
 *    down to the floor) and twin PDUs; darker, heavier.
 * Local frame: the front faces +z, origin on the floor at the cabinet's centre. `cut` opens one side panel as a section
 * cut (hatched cut face around the opening, ink edges), so the servers, the back fans and the hoses show in profile.
 * Never orange: the heat it gives off is drawn by the scene (shimmer, arrows).
 */

export const RACK = {w: 0.6, d: 1.1, h: 2.1};
/** How far the corner posts on a `cut` side stand back from the hatched band's outer face (m): flush faces z-fight. */
const POST_INSET = 0.003;
/** Server rows: [bottom y, height] per unit drawn (m). 'standard' leaves gaps (blanks), 'ai' is full. */
const UNITS_STD: [number, number][] = [
  [0.12, 0.088],
  [0.22, 0.088],
  [0.32, 0.176],
  [0.62, 0.088],
  [0.72, 0.088],
  [0.82, 0.088],
  [1.1, 0.176],
  [1.3, 0.088],
  [1.4, 0.088],
  [1.62, 0.088],
  [1.72, 0.088],
];
const UNITS_AI: [number, number][] = [...Array(10).keys()].map((i) => [0.1 + i * 0.19, 0.176] as [number, number]);

export type ServerRackProps = {
  variant?: 'standard' | 'ai';
  /** Seed for the LEDs' blink pattern. */
  seed?: string;
  /** The video clock (s): LEDs blink on it, so they run on across cuts. */
  clock: number;
  /** Fans' turn so far (revolutions); the back fans show their blades only through a `cut` side. */
  fanTurns?: number;
  /** One server slid out of the front: which unit (index from the bottom) and how far (0 → 1 = 0.55 m). */
  pull?: {unit: number; amount: number};
  /** Open a side as a section cut ('left' = local −x, 'right' = local +x). Default none. */
  cut?: 'left' | 'right';
  /** Ink line thickness (scaled with the camera distance by the scene). Default `INK`. */
  ink?: number;
  /** Cast shadows (default true). */
  shadows?: boolean;
};

const useRackMats = () => {
  const env = useStudioEnv();
  const envScale = useEnvStrength();
  const albedo = useAlbedo();
  const mats = useMemo(() => {
    const phys = (c: string, o: THREE.MeshPhysicalMaterialParameters = {}) =>
      new THREE.MeshPhysicalMaterial({color: raw(c), ...o});
    return {
      frame: phys(REAL.labDark, {metalness: 0.55, roughness: 0.42, clearcoat: 0.2}),
      frameAi: phys(REAL.cable, {metalness: 0.5, roughness: 0.45, clearcoat: 0.2}),
      inside: phys(REAL.cable, {roughness: 0.7}),
      bezel: phys(REAL.cabinet, {metalness: 0.4, roughness: 0.45}),
      bezelAi: phys(REAL.labDark, {metalness: 0.45, roughness: 0.4}),
      blank: phys(REAL.labDark, {metalness: 0.4, roughness: 0.55}),
      vent: new THREE.MeshStandardMaterial({color: raw(REAL.cable), roughness: 0.8}),
      board: phys(REAL.pcb, {roughness: 0.38, clearcoat: 0.5}),
      sink: phys(REAL.alu, {metalness: 0.9, roughness: 0.35}),
      fan: phys(REAL.cable, {roughness: 0.6}),
      fanHub: phys(REAL.labDark, {roughness: 0.5}),
      hose: phys(REAL.hose, {roughness: 0.55, clearcoat: 0.3}),
      hoseCap: phys(REAL.stemAlu, {metalness: 0.9, roughness: 0.3}),
      pdu: phys(REAL.labDark, {roughness: 0.5}),
      handle: phys(REAL.chrome, {metalness: 1, roughness: 0.3}),
      ledA: new THREE.MeshBasicMaterial({color: raw(REAL.statusLed)}),
      ledG: new THREE.MeshBasicMaterial({color: raw(section.signalGreen)}),
      ledOff: new THREE.MeshBasicMaterial({color: raw(section.ledOff)}),
      cut: cutMaterial(),
    };
  }, []);
  useEffect(() => () => Object.values(mats).forEach((m) => m.dispose()), [mats]);
  applyEnv(
    env,
    [
      [mats.frame, 0.7],
      [mats.frameAi, 0.6],
      [mats.bezel, 0.7],
      [mats.bezelAi, 0.6],
      [mats.sink, 1],
      [mats.handle, 1.1],
      [mats.hoseCap, 1],
    ],
    envScale,
  );
  applyAlbedo(
    [mats.frame, mats.frameAi, mats.bezel, mats.bezelAi, mats.blank, mats.board, mats.hose, mats.pdu],
    albedo,
  );
  return mats;
};

const FAN = (() => {
  const s = new THREE.Shape();
  // one blade, swept
  s.moveTo(0.004, 0);
  s.quadraticCurveTo(0.018, 0.006, 0.026, 0.002);
  s.lineTo(0.024, -0.006);
  s.quadraticCurveTo(0.014, -0.004, 0.004, -0.004);
  s.closePath();
  return new THREE.ShapeGeometry(s);
})();

/** A server rack (see the file comment). */
export const ServerRack: React.FC<ServerRackProps> = ({
  variant = 'standard',
  seed = 'rack',
  clock,
  fanTurns = 0,
  pull,
  cut,
  ink = INK,
  shadows = true,
}) => {
  const mats = useRackMats();
  const ai = variant === 'ai';
  const {w, d, h} = RACK;
  const units = ai ? UNITS_AI : UNITS_STD;
  const t = 0.02; // panel thickness
  const geo = useMemo(
    () => ({
      top: roundedBox(w, 0.06, d, 0.01),
      post: new THREE.BoxGeometry(0.04, h - 0.12, 0.04),
      side: new THREE.BoxGeometry(t, h - 0.12, d - 0.08),
      fanRing: new THREE.TorusGeometry(0.032, 0.004, 6, 20),
    }),
    [w, d, h],
  );
  const sx = cut === 'left' ? -1 : cut === 'right' ? 1 : 0;
  // the cut face round the open side: a band 0.04 wide on the side panel's plane
  const band = 0.04;
  const xs = (sx || 1) * (w / 2 - t / 2);
  const cutRects: Rect[] = sx
    ? [
        [
          [xs, 0.06, -d / 2],
          [xs, h - 0.06, -d / 2 + band],
        ],
        [
          [xs, 0.06, d / 2 - band],
          [xs, h - 0.06, d / 2],
        ],
        [
          [xs, h - 0.06 - band, -d / 2],
          [xs, h - 0.06, d / 2],
        ],
        [
          [xs, 0.06, -d / 2],
          [xs, 0.06 + band, d / 2],
        ],
      ]
    : [];
  const frameMat = ai ? mats.frameAi : mats.frame;
  const bezelMat = ai ? mats.bezelAi : mats.bezel;
  const fanCols = ai ? 4 : 2;
  return (
    <group>
      {/* plinth, top, four corner posts */}
      <mesh geometry={geo.top} material={frameMat} position={[0, 0.03, 0]} castShadow={shadows} receiveShadow />
      <mesh geometry={geo.top} material={frameMat} position={[0, h - 0.03, 0]} castShadow={shadows} receiveShadow />
      {[-1, 1].flatMap((a) =>
        [-1, 1].map((b) => (
          <mesh
            key={`${a}${b}`}
            geometry={geo.post}
            material={frameMat}
            // on the cut side the posts sit POST_INSET behind the hatched bands (their outer faces were flush: No. 013 flicker)
            position={[a * (w / 2 - 0.02 - (a === sx ? POST_INSET : 0)), h / 2, b * (d / 2 - 0.02)]}
            castShadow={shadows}
          />
        )),
      )}
      {/* side panels: both closed, or the cut one as hatched bands round an open side */}
      {[-1, 1].map((s) =>
        s === sx ? (
          <group key={s}>
            {cutRects.map((r, i) => {
              const c: V3 = [(r[0][0] + r[1][0]) / 2, (r[0][1] + r[1][1]) / 2, (r[0][2] + r[1][2]) / 2];
              return (
                <mesh key={i} material={mats.cut} position={c}>
                  <boxGeometry args={[t, Math.abs(r[1][1] - r[0][1]), Math.abs(r[1][2] - r[0][2])]} />
                </mesh>
              );
            })}
            <CutOutline
              rects={cutRects.map(
                ([a, b]) =>
                  [
                    [a[0] + s * t * 0.51, a[1], a[2]],
                    [b[0] + s * t * 0.51, b[1], b[2]],
                  ] as Rect,
              )}
              thickness={ink}
            />
            {/* the dark inside of the far panel */}
            <mesh material={mats.inside} position={[-s * (w / 2 - t * 1.5), h / 2, 0]}>
              <boxGeometry args={[0.004, h - 0.14, d - 0.1]} />
            </mesh>
          </group>
        ) : (
          <mesh
            key={s}
            geometry={geo.side}
            material={frameMat}
            position={[s * (w / 2 - t / 2), h / 2, 0]}
            castShadow={shadows}
            receiveShadow
          />
        ),
      )}
      {/* rear PDU(s): vertical strips inside the back */}
      {(ai ? [-1, 1] : [1]).map((s) => (
        <mesh key={`pdu${s}`} material={mats.pdu} position={[s * (w / 2 - 0.07), h / 2, -d / 2 + 0.06]}>
          <boxGeometry args={[0.05, h - 0.3, 0.05]} />
        </mesh>
      ))}
      {/* blank panels behind the servers' fronts (the gaps of a standard rack) */}
      <mesh material={mats.blank} position={[0, h / 2, d / 2 - 0.035]}>
        <boxGeometry args={[w - 0.08, h - 0.16, 0.01]} />
      </mesh>
      {units.map(([y, uh], i) => {
        const out = pull && pull.unit === i ? Math.max(0, Math.min(1, pull.amount)) * 0.55 : 0;
        return (
          <group key={i} position={[0, y + uh / 2, out]}>
            {/* chassis: a closed box, or (through a cut side) its tray and lid only, so the boards show */}
            {sx ? (
              <>
                <mesh material={mats.inside} position={[0, -uh / 2 + 0.004, 0]}>
                  <boxGeometry args={[w - 0.09, 0.006, d - 0.12]} />
                </mesh>
                <mesh material={mats.inside} position={[0, uh / 2 - 0.004, 0]}>
                  <boxGeometry args={[w - 0.09, 0.004, d - 0.12]} />
                </mesh>
              </>
            ) : (
              <mesh material={ai ? mats.bezelAi : mats.inside} castShadow={shadows && out > 0}>
                <boxGeometry args={[w - 0.09, uh - 0.006, d - 0.12]} />
              </mesh>
            )}
            {/* front bezel with vents, a handle each side, LEDs */}
            <mesh material={bezelMat} position={[0, 0, d / 2 - 0.05]}>
              <boxGeometry args={[w - 0.08, uh - 0.008, 0.012]} />
            </mesh>
            <mesh material={mats.vent} position={[-0.05, 0, d / 2 - 0.043]}>
              <planeGeometry args={[w * 0.55, uh * 0.55]} />
            </mesh>
            {[-1, 1].map((s) => (
              <mesh key={s} material={mats.handle} position={[s * (w / 2 - 0.06), 0, d / 2 - 0.038]}>
                <boxGeometry args={[0.012, uh * 0.6, 0.012]} />
              </mesh>
            ))}
            {[0, 1, 2].map((k) => {
              const phase = random(`${seed}-ph-${i}-${k}`);
              const rate = 1.2 + 3 * random(`${seed}-rt-${i}-${k}`);
              const on = random(`${seed}-${i}-${k}-${Math.floor(clock * rate + phase * 7)}`) > (k === 0 ? 0.1 : 0.4);
              return (
                <mesh
                  key={k}
                  material={on ? (k === 0 ? mats.ledG : mats.ledA) : mats.ledOff}
                  position={[w / 2 - 0.13 + k * 0.022, uh * 0.22, d / 2 - 0.043]}
                >
                  <planeGeometry args={[0.012, 0.012]} />
                </mesh>
              );
            })}
            {/* inside (shows through a cut side): board, heat sinks */}
            {sx ? (
              <>
                <mesh material={mats.board} position={[0, -uh / 2 + 0.012, 0]}>
                  <boxGeometry args={[w - 0.1, 0.004, d - 0.2]} />
                </mesh>
                {(ai ? [-0.25, -0.05, 0.15] : [-0.1, 0.12]).map((z, k) => (
                  <mesh key={k} material={mats.sink} position={[0, -uh / 2 + 0.012 + uh * 0.3, z]}>
                    <boxGeometry args={[w * 0.45, uh * 0.55, 0.12]} />
                  </mesh>
                ))}
              </>
            ) : null}
            {/* rear fans: a row per server, blades turning (seen at the back and through a cut side) */}
            {[...Array(fanCols).keys()].map((c) => {
              const fx = (c - (fanCols - 1) / 2) * ((w - 0.12) / fanCols);
              const spin = (fanTurns * (1 + 0.07 * ((i + c) % 3)) + random(`${seed}-fan-${i}-${c}`)) * Math.PI * 2;
              return (
                <group key={c} position={[fx, 0, -d / 2 + 0.035]}>
                  <mesh
                    geometry={geo.fanRing}
                    material={mats.fan}
                    rotation={[0, Math.PI, 0]}
                    scale={Math.min(1, uh / 0.08)}
                  />
                  <group rotation={[0, Math.PI, spin]} scale={Math.min(1, uh / 0.08)}>
                    {[0, 1, 2, 3, 4].map((b) => (
                      <mesh key={b} geometry={FAN} material={mats.fan} rotation={[0, 0, (b / 5) * Math.PI * 2]} />
                    ))}
                    <mesh material={mats.fanHub}>
                      <circleGeometry args={[0.01, 12]} />
                    </mesh>
                  </group>
                </group>
              );
            })}
          </group>
        );
      })}
      {/* AI rack: coolant manifold and two hoses down the back to the floor */}
      {ai
        ? [-1, 1].map((s) => (
            <group key={`hose${s}`} position={[s * 0.12, 0, -d / 2 + 0.11]}>
              <mesh material={mats.hose} position={[0, h / 2 - 0.05, 0]}>
                <cylinderGeometry args={[0.022, 0.022, h - 0.25, 12]} />
              </mesh>
              <mesh material={mats.hoseCap} position={[0, h - 0.17, 0]}>
                <cylinderGeometry args={[0.03, 0.03, 0.05, 12]} />
              </mesh>
              <mesh material={mats.hose} position={[0, 0.07, 0.03]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.05, 0.022, 8, 12, Math.PI / 2]} />
              </mesh>
            </group>
          ))
        : null}
    </group>
  );
};
