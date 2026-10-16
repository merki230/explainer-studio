import React, {useMemo} from 'react';
import {Easing, interpolate} from 'remotion';
import * as THREE from 'three';
import {fonts} from '../../fonts';
import {LAB, MOODS, type Mood} from '../../theme';
import {BlobShadow} from '../MuseumStage';
import {limb, raw, roundedBox} from '../plaster';
import {CutOutline, cutMaterial} from './cutLook';
import {CUT_EDGES, CUT_RECTS, SLICE} from './LivingRoomSlice';
import {skyTexture} from './textures';
import {useFontsLoaded} from './useFontsLoaded';
import {TireBay, type TireBayProps} from './TireBay';
import {
  RealBench,
  RealConveyor,
  RealPhoneRow,
  RealRail,
  RealRig,
  RealRobotArm,
  RealWallDevice,
  useLabMaterials,
} from '../real/RealLab';

type V3 = [number, number, number];

const {width: W, depth: D, x0: X0, z0: Z0, wallHeight: WALL_H, wallThickness: WALL_T, groundDepth: GROUND} = SLICE;

/** Lab layout (same block as the living room: same size, same cut faces, same camera). */
export const LAB_LAYOUT = {
  bench: {y: 0.84, z: -0.6, width: 2.7, depth: 0.5},
  phones: 9,
  phoneX: (i: number) => -1.12 + i * 0.28,
  rail: {y: 1.52, z: -0.62},
  // the counter and the meter sit left of centre (counter −0.62 → −0.92, meter 0.72 → 0.02), so
  // at the wide framing the meter's 40 px header ends inside x 888 (at 0.72 it ran off the frame)
  counter: [-0.92, 1.98, Z0 + 0.012] as V3,
  counterSize: [1.25, 0.52] as [number, number],
  meter: [0.02, 1.86, Z0 + 0.012] as V3,
  meterSize: [0.36, 0.95] as [number, number],
  /** The meter's "AUDIO SENT" header panel above it: centre height and face size. */
  meterHeader: {y: 2.5, size: [0.82, 0.16] as [number, number]},
  /** The "0" stamp lands on the audio meter itself (in frame at every framing). */
  stamp: [0.02, 1.9, Z0 + 0.06] as V3,
  rig: [1.18, 0.35, 0.5] as V3,
};

const ease = (x: number, a: number, b: number) =>
  interpolate(x, [a, b], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

/** The header label's canvas (px): the face's 0.82 × 0.16 shape. */
const LABEL_PX: [number, number] = [656, 128];

/** A canvas texture redrawn only when its text changes (fonts must be loaded first). */
const useCanvasText = (w: number, h: number) =>
  useMemo(() => {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const t = new THREE.CanvasTexture(c);
    return {c, t, key: ''};
  }, [w, h]);

export type LabSliceProps = {
  mood: Mood;
  /** Seconds into the scene (drives the counter and the stamp). */
  t: number;
  /**
   * Seconds on the video clock (drives the arms, the conveyor, the icons), so consecutive Lab scenes
   * continue the same motion across the cut. Default: `t`.
   */
  clock?: number;
  /** The count the counter reaches (default 17,000). */
  count?: number;
  /** Seconds into the scene when the counter starts and how long it takes. */
  countAt?: number;
  countFor?: number;
  /** Seconds into the scene when the "0" stamp lands on the audio meter (none if undefined). */
  zeroAt?: number;
  /** Robot arms tapping and the conveyor running (default on). */
  running?: boolean;
  /**
   * Realism pass: real equipment (steel bench and ESD mat, realistic test phones in fixtures, industrial
   * arms on a rail with cable looms and stylus grippers, a belt conveyor, a rig cabinet, the counter and
   * the meter as wall devices behind glass). Same layout and motion. Default false.
   */
  realism?: boolean;
  /** What the Lab is dressed as: 'apps' (default: the phone bench, arms, counter, meter) or 'tire-bay'. */
  dressing?: 'apps' | 'tire-bay';
  /** The tire bay's rows, low tires and gauges (see `TireBayProps`). */
  tireBay?: Partial<TireBayProps>;
};

/**
 * The Lab: a test room cut open in the house style (same block, cut faces, hatch and ink as the
 * living room). A long bench with a row of test phones on stands; robot arms on a rail tap them in
 * sequence; app icons ride a conveyor from a test rig to the bench; a counter built into the back
 * wall rises to 17,000; a big audio meter beside it stays flat; a "0" stamp lands on cue. Neutral
 * colours; nothing here is the system, so nothing is orange.
 */
export const LabSlice: React.FC<LabSliceProps> = ({
  mood,
  t,
  count = 17000,
  countAt = 0.4,
  countFor = 3.2,
  zeroAt,
  running = true,
  realism = false,
  clock: clockIn,
  dressing = 'apps',
  tireBay,
}) => {
  const bay = dressing === 'tire-bay';
  const clock = clockIn ?? t;
  const m = MOODS[mood];
  const lab = LAB[mood];
  const ready = useFontsLoaded();
  const mats = useMemo(() => {
    const cut = cutMaterial();
    const std = (c: string, r = 0.9) => new THREE.MeshStandardMaterial({color: raw(c), roughness: r, metalness: 0});
    return {
      cut,
      earth: std(m.earth, 1),
      floor: std(lab.floor, 0.95),
      wall: std(m.wall, 0.95),
      sky: new THREE.MeshBasicMaterial({map: skyTexture(mood), fog: false}),
      bench: std(lab.bench, 0.8),
      leg: std(m.device, 0.5),
      rig: std(lab.rig, 0.8),
      arm: std(lab.arm, 0.7),
      joint: std(lab.joint, 0.5),
      phone: std(m.device, 0.4),
      panel: new THREE.MeshStandardMaterial({color: raw(lab.panel), roughness: 0.6}),
      segOff: new THREE.MeshBasicMaterial({color: raw(lab.segOff)}),
      segLow: new THREE.MeshBasicMaterial({color: raw(lab.segLow)}),
      screen: new THREE.MeshBasicMaterial({color: raw(m.ui)}),
      icons: lab.icons.map((c) => new THREE.MeshBasicMaterial({color: raw(c)})),
      iconsLit: lab.icons.map((c) => std(c, 0.6)),
      stamp: new THREE.MeshBasicMaterial({color: raw(m.ink), transparent: true}),
      counter: new THREE.MeshBasicMaterial({transparent: false}),
      labelMat: new THREE.MeshBasicMaterial({transparent: true}),
      stampText: new THREE.MeshBasicMaterial({transparent: true}),
    };
  }, [m, lab, mood]);
  mats.sky.color.setScalar(1 / m.exposure);

  // the counter: Archivo digits on the dark panel built into the wall
  const value = Math.round(count * ease(t, countAt, countAt + countFor));
  const counter = useCanvasText(512, 212);
  const label = useCanvasText(LABEL_PX[0], LABEL_PX[1]);
  const stampTex = useCanvasText(256, 256);
  if (ready) {
    const key = `${value}|${mood}`;
    if (counter.key !== key) {
      const cx = counter.c.getContext('2d')!;
      cx.fillStyle = lab.panel;
      cx.fillRect(0, 0, 512, 212);
      cx.fillStyle = lab.panelInk;
      cx.globalAlpha = 0.7;
      cx.font = `700 30px ${fonts.sans}, Arial`;
      cx.textAlign = 'left';
      cx.textBaseline = 'middle';
      cx.fillText('APPS TESTED', 34, 42);
      cx.globalAlpha = 1;
      cx.font = `800 118px ${fonts.display}, Arial`;
      cx.fillText(value.toLocaleString('en-US'), 30, 142);
      counter.t.needsUpdate = true;
      counter.key = key;
      mats.counter.map = counter.t;
      mats.counter.needsUpdate = true;
    }
    if (label.key !== mood) {
      // the meter's header: on the dark panel like the counter's "APPS TESTED", in its ink
      const [lw, lh] = LABEL_PX;
      const cx = label.c.getContext('2d')!;
      cx.fillStyle = lab.panel;
      cx.fillRect(0, 0, lw, lh);
      cx.fillStyle = lab.panelInk;
      cx.font = `700 ${Math.round(lh * 0.6)}px ${fonts.sans}, Arial`;
      cx.textAlign = 'center';
      cx.textBaseline = 'middle';
      cx.fillText('AUDIO SENT', lw / 2, lh * 0.54, lw - 24);
      label.t.needsUpdate = true;
      label.key = mood;
      mats.labelMat.map = label.t;
      mats.labelMat.needsUpdate = true;
    }
    if (stampTex.key !== mood) {
      const cx = stampTex.c.getContext('2d')!;
      cx.clearRect(0, 0, 256, 256);
      // a paper disc, so the stamp reads on the dark meter
      cx.fillStyle = m.paper;
      cx.beginPath();
      cx.arc(128, 128, 120, 0, Math.PI * 2);
      cx.fill();
      cx.strokeStyle = m.ink;
      cx.lineWidth = 12;
      cx.beginPath();
      cx.arc(128, 128, 108, 0, Math.PI * 2);
      cx.stroke();
      cx.fillStyle = m.ink;
      cx.font = `800 170px ${fonts.display}, Arial`;
      cx.textAlign = 'center';
      cx.textBaseline = 'middle';
      cx.fillText('0', 128, 140);
      stampTex.t.needsUpdate = true;
      stampTex.key = mood;
      mats.stampText.map = stampTex.t;
      mats.stampText.needsUpdate = true;
    }
  }

  const L = LAB_LAYOUT;
  const benchTop = L.bench.y + 0.03;
  // arms: 4, each serving two neighbouring phones; a tap every 0.6 s, a slide between its two
  // phones every 2.4 s, each arm offset so the taps run down the bench in sequence
  const arms = [0, 1, 2, 3].map((i) => {
    const local = running ? clock + i * 0.3 : 0;
    const slide = 0.5 - 0.5 * Math.cos((local / 2.4) * Math.PI * 2);
    const x = L.phoneX(2 * i) + (L.phoneX(2 * i + 1) - L.phoneX(2 * i)) * ease(slide, 0.2, 0.8);
    const cyc = (local / 0.6) % 1;
    const tap = running ? Math.max(0, 1 - Math.abs(cyc - 0.2) / 0.15) : 0; // a quick press
    const tipY = benchTop + 0.32 - 0.16 * tap;
    const which = slide < 0.5 ? 2 * i : 2 * i + 1;
    return {x, tipY, tap, which};
  });
  const tapped = new Map(arms.map((a) => [a.which, a.tap]));

  // conveyor: icons ride from the rig up to the bench's right end, one every 0.55 s
  const belt0 = new THREE.Vector3(L.rig[0] - 0.05, L.rig[1] + 0.38, L.rig[2] - 0.1);
  const belt1 = new THREE.Vector3(1.3, benchTop + 0.02, L.bench.z + 0.12);
  const beltLen = belt0.distanceTo(belt1);
  const beltDir = belt1.clone().sub(belt0).normalize();
  const beltPart = limb(belt0, belt1, 0.025);
  const icons = new Array(6).fill(0).map((_, i) => {
    const u = (((running ? clock : 0) * 0.32) / beltLen + i / 6) % 1;
    const p = belt0.clone().addScaledVector(beltDir, u * beltLen);
    const fade = Math.min(1, u / 0.08, (1 - u) / 0.08);
    const n = Math.floor(((running ? clock : 0) * 0.32) / beltLen + i / 6);
    return {p, s: fade, mat: mats.iconsLit[(i + n) % mats.iconsLit.length]};
  });

  // meter: flat. One dim segment at the bottom, the rest off (nothing sent)
  const SEG = 14;
  const [mx, my, mz] = L.meter;
  const [mw, mh] = L.meterSize;
  const stampIn = zeroAt === undefined ? 0 : ease(t, zeroAt, zeroAt + 0.35);
  mats.stamp.opacity = stampIn;
  mats.stampText.opacity = stampIn;

  return (
    <group>
      <mesh position={[0, 6, -9]} material={mats.sky}>
        <planeGeometry args={[40, 30]} />
      </mesh>
      <mesh
        position={[0, -GROUND / 2, Z0 + D / 2]}
        material={[mats.cut, mats.earth, mats.floor, mats.earth, mats.cut, mats.earth]}
        receiveShadow
      >
        <boxGeometry args={[W, GROUND, D]} />
      </mesh>
      <mesh
        position={[0, WALL_H / 2, Z0 - WALL_T / 2]}
        material={[mats.cut, mats.cut, mats.cut, mats.cut, mats.wall, mats.wall]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[W, WALL_H, WALL_T]} />
      </mesh>
      <mesh
        position={[X0 - WALL_T / 2, WALL_H / 2, Z0 + D / 2 - WALL_T / 2]}
        material={[mats.wall, mats.wall, mats.cut, mats.cut, mats.cut, mats.cut]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[WALL_T, WALL_H, D + WALL_T]} />
      </mesh>
      <CutOutline rects={CUT_RECTS} edges={CUT_EDGES} />

      {bay ? (
        <TireBay mood={mood} t={t} {...(tireBay ?? {})} />
      ) : (
        <>
      {/* the counter built into the back wall */}
      {realism ? null : (
        <mesh
          geometry={roundedBox(L.counterSize[0] + 0.06, L.counterSize[1] + 0.06, 0.04, 0.01)}
          material={mats.panel}
          position={[L.counter[0], L.counter[1], L.counter[2] + 0.005]}
        />
      )}
      <mesh position={[L.counter[0], L.counter[1], L.counter[2] + 0.027]} material={mats.counter} visible={ready}>
        <planeGeometry args={L.counterSize} />
      </mesh>

      {/* the audio meter: segments stay off (flat), its label under it */}
      {realism ? null : (
        <mesh geometry={roundedBox(mw, mh, 0.04, 0.01)} material={mats.panel} position={[mx, my, mz + 0.005]} />
      )}
      {new Array(SEG).fill(0).map((_, i) => (
        <mesh
          key={i}
          position={[mx, my - mh / 2 + 0.07 + (i * (mh - 0.12)) / (SEG - 1), mz + 0.027]}
          material={i === 0 ? mats.segLow : mats.segOff}
        >
          <planeGeometry args={[mw - 0.1, 0.04]} />
        </mesh>
      ))}
      {/* its header: a panel above the meter, clear of the arms below (≈ 40 px text at the wide shot) */}
      {realism ? null : (
        <mesh
          geometry={roundedBox(L.meterHeader.size[0] + 0.06, L.meterHeader.size[1] + 0.06, 0.04, 0.01)}
          material={mats.panel}
          position={[mx, L.meterHeader.y, mz + 0.005]}
        />
      )}
      <mesh position={[mx, L.meterHeader.y, mz + 0.027]} material={mats.labelMat} visible={ready}>
        <planeGeometry args={L.meterHeader.size} />
      </mesh>
      {/* the "0" stamp, landing on cue */}
      <mesh
        position={L.stamp}
        material={mats.stampText}
        scale={0.8 + 0.2 * stampIn}
        rotation={[0, 0, -0.12 * (1 - stampIn) - 0.08]}
        visible={ready && stampIn > 0.01}
      >
        <planeGeometry args={[0.5, 0.5]} />
      </mesh>

      {realism ? (
        <RealLabEquipment
          t={running ? clock : 0}
          benchTop={benchTop}
          arms={arms}
          tapped={tapped}
          screen={mats.screen}
          iconFor={(i) => mats.icons[(i + Math.floor((running ? clock : 0) / 1.2)) % mats.icons.length]}
          belt={[belt0, belt1]}
          icons={icons}
        />
      ) : (
        <>
          {/* the bench and its phones */}
          <mesh
            geometry={roundedBox(L.bench.width, 0.06, L.bench.depth, 0.015, 5)}
            material={mats.bench}
            position={[0, L.bench.y, L.bench.z]}
            castShadow
            receiveShadow
          />
          {[-1, 1].flatMap((sx) =>
            [-1, 1].map((sz) => (
              <mesh
                key={`${sx}${sz}`}
                position={[sx * (L.bench.width / 2 - 0.08), L.bench.y / 2, L.bench.z + sz * (L.bench.depth / 2 - 0.06)]}
                material={mats.leg}
                castShadow
              >
                <boxGeometry args={[0.04, L.bench.y, 0.04]} />
              </mesh>
            )),
          )}
          {new Array(L.phones).fill(0).map((_, i) => {
            const x = L.phoneX(i);
            const tp = tapped.get(i) ?? 0;
            const icon = mats.icons[(i + Math.floor((running ? clock : 0) / 1.2)) % mats.icons.length];
            return (
              <group key={i} position={[x, benchTop + 0.1, L.bench.z - 0.02]} rotation={[-0.45, 0, 0]}>
                <mesh geometry={roundedBox(0.11, 0.2, 0.014, 0.006)} material={mats.phone} castShadow />
                <mesh position={[0, 0, 0.0075]} material={mats.screen}>
                  <planeGeometry args={[0.098, 0.185]} />
                </mesh>
                {/* the app under test: a coloured icon on its screen, which brightens when tapped */}
                <mesh position={[0, 0.02, 0.008]} material={icon} scale={1 + 0.25 * tp}>
                  <planeGeometry args={[0.05, 0.05]} />
                </mesh>
                {/* a small stand */}
                <mesh position={[0, -0.09, -0.03]} material={mats.leg}>
                  <boxGeometry args={[0.06, 0.03, 0.05]} />
                </mesh>
              </group>
            );
          })}

          {/* the rail and the robot arms */}
          <mesh position={[0, L.rail.y, L.rail.z]} material={mats.joint} castShadow>
            <boxGeometry args={[2.6, 0.04, 0.06]} />
          </mesh>
          {arms.map((a, i) => {
            const top = new THREE.Vector3(a.x, L.rail.y - 0.03, L.rail.z);
            const elbow = new THREE.Vector3(a.x + 0.02, (L.rail.y + a.tipY) / 2 + 0.06, L.rail.z + 0.14);
            const tip = new THREE.Vector3(a.x, a.tipY, L.bench.z + 0.02);
            const u = limb(top, elbow, 0.022);
            const f = limb(elbow, tip, 0.018);
            return (
              <group key={i}>
                <mesh position={[a.x, L.rail.y, L.rail.z]} material={mats.arm} castShadow>
                  <boxGeometry args={[0.1, 0.07, 0.1]} />
                </mesh>
                <mesh
                  geometry={u.geometry}
                  position={u.position}
                  quaternion={u.quaternion}
                  material={mats.arm}
                  castShadow
                />
                <mesh
                  geometry={f.geometry}
                  position={f.position}
                  quaternion={f.quaternion}
                  material={mats.arm}
                  castShadow
                />
                <mesh position={elbow} material={mats.joint}>
                  <sphereGeometry args={[0.03, 12, 10]} />
                </mesh>
                <mesh position={tip} material={mats.joint}>
                  <sphereGeometry args={[0.022, 12, 10]} />
                </mesh>
              </group>
            );
          })}

          {/* the test rig and its conveyor of app icons */}
          <mesh
            geometry={roundedBox(0.5, 0.7, 0.5, 0.03, 5)}
            material={mats.rig}
            position={L.rig}
            castShadow
            receiveShadow
          />
          <mesh position={[L.rig[0], L.rig[1] + 0.37, L.rig[2]]} material={mats.joint}>
            <boxGeometry args={[0.3, 0.04, 0.3]} />
          </mesh>
          <mesh
            geometry={beltPart.geometry}
            position={beltPart.position}
            quaternion={beltPart.quaternion}
            material={mats.joint}
            castShadow
          />
          {icons.map((ic, i) => (
            <mesh
              key={i}
              geometry={roundedBox(0.08, 0.08, 0.025, 0.012)}
              material={ic.mat}
              position={[ic.p.x, ic.p.y + 0.05, ic.p.z]}
              scale={ic.s}
              visible={ic.s > 0.01}
              castShadow
            />
          ))}

          {/* contact shadows: under the bench and the rig */}
          <BlobShadow position={[0, 0.004, L.bench.z]} size={[3.0, 0.9]} opacity={0.3} />
          <BlobShadow position={[L.rig[0], 0.004, L.rig[2]]} size={[0.9, 0.9]} opacity={0.3} />
        </>
      )}
        </>
      )}
    </group>
  );
};

type Arm = {x: number; tipY: number; tap: number; which: number};

/** The Lab's realistic equipment (realism pass), driven by the same motion as the stylized parts. */
const RealLabEquipment: React.FC<{
  t: number;
  benchTop: number;
  arms: Arm[];
  tapped: Map<number, number>;
  screen: THREE.Material;
  iconFor: (i: number) => THREE.Material;
  belt: [THREE.Vector3, THREE.Vector3];
  icons: {p: THREE.Vector3; s: number; mat: THREE.Material}[];
}> = ({t, benchTop, arms, tapped, screen, iconFor, belt, icons}) => {
  const mats = useLabMaterials();
  const L = LAB_LAYOUT;
  const xs = useMemo(() => new Array(L.phones).fill(0).map((_, i) => L.phoneX(i)), [L]);
  return (
    <group>
      <RealWallDevice mats={mats} position={L.counter} size={L.counterSize} />
      <RealWallDevice mats={mats} position={L.meter} size={L.meterSize} />
      <RealWallDevice
        mats={mats}
        position={[L.meter[0], L.meterHeader.y, L.meter[2]]}
        size={L.meterHeader.size}
      />
      <RealBench mats={mats} y={L.bench.y} z={L.bench.z} width={L.bench.width} depth={L.bench.depth} />
      <RealPhoneRow mats={mats} xs={xs} y={benchTop + 0.115} z={L.bench.z - 0.02} tilt={-0.45} height={0.2}>
        {(i, dw, dh, front) => {
          const tp = tapped.get(i) ?? 0;
          return (
            <>
              <mesh position={[0, 0, front]} material={screen}>
                <planeGeometry args={[dw, dh]} />
              </mesh>
              <mesh position={[0, 0.02, front + 0.0006]} material={iconFor(i)} scale={1 + 0.25 * tp}>
                <planeGeometry args={[0.05, 0.05]} />
              </mesh>
            </>
          );
        }}
      </RealPhoneRow>
      <RealRail mats={mats} y={L.rail.y} z={L.rail.z} length={2.6} />
      {arms.map((a, i) => {
        const top: V3 = [a.x, L.rail.y - 0.03, L.rail.z];
        const elbow = new THREE.Vector3(
          a.x + 0.02,
          (L.rail.y + benchTop + 0.29 - 0.11 * a.tap) / 2 + 0.06,
          L.rail.z + 0.14,
        );
        // the stylus reaches the screens (the stylized arms stopped short)
        const tip = new THREE.Vector3(a.x, benchTop + 0.29 - 0.11 * a.tap, L.bench.z + 0.02);
        return <RealRobotArm key={i} mats={mats} shoulder={top} elbow={elbow} tip={tip} />;
      })}
      <RealRig mats={mats} position={L.rig} />
      <RealConveyor mats={mats} a={belt[0]} b={belt[1]} t={t} speed={0.32} />
      {icons.map((ic, i) => (
        <mesh
          key={i}
          geometry={roundedBox(0.08, 0.08, 0.025, 0.012)}
          material={ic.mat}
          position={[ic.p.x, ic.p.y + 0.075, ic.p.z]}
          scale={ic.s}
          visible={ic.s > 0.01}
          castShadow
        />
      ))}
    </group>
  );
};
