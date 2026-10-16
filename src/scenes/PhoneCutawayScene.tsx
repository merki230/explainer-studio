import React, {useMemo} from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {drawScreenFit, screenKey, screenStateAt, type ScreenState, type ScreenStep} from '../components/screenKit';
import {MOODS, section, type Mood} from '../theme';
import {BlobShadow} from '../three/MuseumStage';
import {raw, roundedBox} from '../three/plaster';
import {CutOutline, cutMaterial} from '../three/section/cutLook';
import {projectToFrame, SectionCamera, sectionCameraAt, type Framing} from '../three/section/SectionCamera';
import {SectionLights, SectionStage} from '../three/section/SectionStage';
import {skyTexture} from '../three/section/textures';
import {Callout} from '../components/Callout';
import {PhoneTeardown, WAKE_CHIP} from '../three/real/PhoneTeardown';
import {REAL_DISPLAY, REAL_FRONT, RealPhone} from '../three/real/RealPhone';
import {useFontsLoaded} from '../three/section/useFontsLoaded';

type V3 = [number, number, number];

export type PhoneCutawaySceneProps = {
  durationInFrames: number;
  /** Day (default) or Night. */
  mood?: Mood;
  /** Seconds the camera takes to glide in to the phone at the start (default 1.0; 0: start close). */
  glideIn?: number;
  /** Seconds into the scene when the phone's front comes off and the section shows (default 0.9). */
  cutAt?: number;
  /** Seconds into the scene when sound waves start drifting in from the room (default 1.6). */
  wavesAt?: number;
  /** Seconds between waves (default 0.9). */
  waveEvery?: number;
  /** Seconds into the scene when the "Hey…" wave sets off; the chip lights when it arrives (≈ 1.2 s later). */
  wakeAt?: number;
  /** The hatch toward the network stays shut (default true). False: it stays shut until `doorOpenAt`. */
  doorShut?: boolean;
  doorOpenAt?: number;
  /** Which location this is (default 'phone-cutaway'): from the room it slides in, or follows the line. */
  location?: string;
  transition?: 'auto' | 'cut' | 'dissolve' | 'slide' | 'follow';
  follow?: {direction?: 'down' | 'up' | 'left' | 'right'; at?: number};
  /**
   * Realism test (owner rule "objects realistic, people stylized"): a realistic phone (aluminium
   * frame, glass, buttons, camera bump, live screen) opening onto a teardown (logic board, labelled
   * wake-word chip, battery, shields, flexes), lit with studio reflections. Same timing and story
   * beats as the default look. Default false.
   */
  realism?: boolean;
  /** Screen-space ambient occlusion (N8AO) at the mood's strength. Default: follows `realism`. */
  ao?: boolean;
  /** Realism: what the screen shows before the front comes off (phone-screen kit; default the lock screen). */
  screen?: ScreenStep[];
  /** Realism: the phones' clock and date on the screen (default "7:58" / Wednesday, October 15 in Day). */
  clock?: string;
  date?: string;
  /**
   * Realism: the callout on the wake-word chip once the phone is open (the § 6 drawing label: ink
   * elbow leader, uppercase on a paper halo). Default 'Wake-word chip'; null for none.
   */
  chipLabel?: string | null;
  /** Realism: seconds into the scene when the chip's callout comes in (default `cutAt` + 0.8). */
  chipLabelAt?: number;
  /** Idle sideways camera drift, ± units (default 0.05; 0 holds the frame still). */
  drift?: number;
  /** Turn the phone about its vertical axis, radians (default 0: screen to the camera; ≈ 2.6 shows the back). */
  yaw?: number;
  /** The scene's first frame in the video (set by Explainer). */
  startFrame?: number;
};

// The phone, at the scale of a section model: standing on a cut plinth.
const PH = {w: 1.0, h: 1.9, d: 0.16, y: 1.2};
const CHIP: V3 = [0.14, 1.62, 0.0];
const FRONT = PH.d / 2;
const RIM = 0.07; // the cut face round the opening

const ease = (x: number, a: number, b: number) =>
  interpolate(x, [a, b], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

/** The network above the hatch: an ink cloud with a shut padlock (drawn once the fonts are in). */
const NetworkIcon: React.FC<{ink: string; mat: THREE.MeshBasicMaterial; fine?: boolean}> = ({
  ink,
  mat,
  fine = false,
}) => {
  const ready = useFontsLoaded();
  const tex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 192;
    return {c, t: new THREE.CanvasTexture(c), key: ''};
  }, []);
  const key = `${ink}:${fine}`;
  if (ready && tex.key !== key) {
    const cx = tex.c.getContext('2d')!;
    cx.clearRect(0, 0, 256, 192);
    cx.strokeStyle = ink;
    cx.fillStyle = ink;
    cx.lineWidth = fine ? 4.5 : 7;
    cx.lineJoin = 'round';
    cx.beginPath();
    cx.arc(92, 78, 30, Math.PI * 0.9, Math.PI * 1.95);
    cx.arc(142, 60, 38, Math.PI * 1.15, Math.PI * 1.95);
    cx.arc(186, 86, 26, Math.PI * 1.45, Math.PI * 0.5);
    cx.lineTo(80, 112);
    cx.arc(80, 90, 22, Math.PI * 0.5, Math.PI * 1.2);
    cx.stroke();
    cx.lineWidth = fine ? 4.5 : 6;
    cx.beginPath();
    cx.arc(128, 142, 14, Math.PI, 0);
    cx.stroke();
    cx.fillRect(108, 142, 40, 32);
    tex.t.needsUpdate = true;
    tex.key = key;
    mat.map = tex.t;
    mat.needsUpdate = true;
  }
  return (
    <mesh position={[0, 0.38, 0.05]} material={mat} visible={ready}>
      <planeGeometry args={[0.5, 0.375]} />
    </mesh>
  );
};

/** Draws the screen state into the realistic phone's display canvas (inside the canvas: it waits for the fonts). */
const PaintScreen: React.FC<{
  target: {c: HTMLCanvasElement; tex: THREE.CanvasTexture; key: string};
  state: ScreenState;
}> = ({target, state}) => {
  const ready = useFontsLoaded();
  const k = screenKey(state);
  if (ready && k !== target.key) {
    const cx = target.c.getContext('2d');
    if (cx) {
      drawScreenFit(cx, state, target.c.width, target.c.height);
      target.tex.needsUpdate = true;
      target.key = k;
    }
  }
  return null;
};

/**
 * Realism: the network as a technical-drawing annotation: a fine ink line icon (a cloud with a
 * shut padlock under it), no fill, no text. Drawn once the fonts are in (canvas).
 */
const NetworkGlyph: React.FC<{ink: string; mat: THREE.MeshBasicMaterial; position: V3}> = ({ink, mat, position}) => {
  const ready = useFontsLoaded();
  const tex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 384;
    c.height = 288;
    const t = new THREE.CanvasTexture(c);
    t.anisotropy = 4;
    return {c, t, key: ''};
  }, []);
  if (ready && tex.key !== ink) {
    const cx = tex.c.getContext('2d')!;
    cx.clearRect(0, 0, 384, 288);
    cx.strokeStyle = ink;
    cx.fillStyle = ink;
    cx.lineWidth = 6;
    cx.lineJoin = 'round';
    cx.lineCap = 'round';
    // cloud
    cx.beginPath();
    cx.arc(132, 112, 42, Math.PI * 0.85, Math.PI * 1.9);
    cx.arc(200, 86, 54, Math.PI * 1.12, Math.PI * 1.95);
    cx.arc(262, 122, 38, Math.PI * 1.42, Math.PI * 0.5);
    cx.lineTo(118, 160);
    cx.arc(118, 128, 32, Math.PI * 0.5, Math.PI * 1.2);
    cx.stroke();
    // padlock: shackle, body, keyhole
    cx.beginPath();
    cx.arc(192, 206, 18, Math.PI, 0);
    cx.lineTo(210, 222);
    cx.moveTo(174, 222);
    cx.lineTo(174, 206);
    cx.stroke();
    cx.beginPath();
    cx.roundRect(160, 222, 64, 50, 6);
    cx.stroke();
    cx.beginPath();
    cx.arc(192, 243, 6, 0, Math.PI * 2);
    cx.fill();
    cx.fillRect(189.5, 246, 5, 14);
    tex.t.needsUpdate = true;
    tex.key = ink;
    mat.map = tex.t;
    mat.needsUpdate = true;
  }
  return (
    <mesh position={position} material={mat} visible={ready}>
      <planeGeometry args={[0.4, 0.3]} />
    </mesh>
  );
};

/** A thin arc of a sound wave, facing the camera's side of the room. */
const ARC = new THREE.TorusGeometry(1, 0.03, 6, 40, Math.PI * 0.55);
/** Realism: the same arc as a fine ink line (≈ 3–5 px at the close framing), smoother. */
const ARC_FINE = new THREE.TorusGeometry(1, 0.011, 6, 72, Math.PI * 0.6);
/** Realism: the "Hey…" waveform glyph, a run of thin rounded bars (a fixed envelope). */
const HEY_BARS = [0.22, 0.4, 0.75, 1, 0.82, 0.55, 0.9, 0.7, 0.45, 0.62, 0.35, 0.2, 0.12];
const BAR = new THREE.CapsuleGeometry(0.006, 0.2, 3, 8);
/** Realism: the ink leader from the shutter to the network icon (≈ 2 px at the close framing). */
const LEADER = {t: 0.0045, up: 0.14, across: 0.2};
/** Realism: the shutter's place on the top edge (left of the middle, clear of the chip's callout). */
const SHUTTER_X = -0.24;

/**
 * A phone cut open (the house section style: hatched cut faces, ink cut edges) to show what the
 * wake-word check does: sound waves drift in from the room and most fade into the small listening
 * chip (discarded); a "Hey…" wave lights the chip; the hatch toward the network stays shut. For
 * "It does listen for its wake word … with nothing sent until it thinks it hears the phrase".
 * Neutral colours and ink; the chip lights in the mood's screen-light colour (this is not the
 * hidden system, so nothing is orange).
 */
export const PhoneCutawayScene: React.FC<PhoneCutawaySceneProps> = ({
  durationInFrames,
  mood = 'day',
  glideIn = 1.0,
  cutAt = 0.9,
  wavesAt = 1.6,
  waveEvery = 0.9,
  wakeAt,
  doorShut = true,
  doorOpenAt,
  realism = false,
  ao,
  screen = [{at: 0, app: 'lock'}],
  clock,
  date,
  yaw = 0,
  drift = 0.05,
  chipLabel = 'Wake-word chip',
  chipLabelAt,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const m = MOODS[mood];

  // camera: glides in from the room's distance to the phone, then a slow push
  const close: Framing = {look: [0.05, 1.32, 0], distance: 8.2};
  const far: Framing = {look: [0.05, 1.2, 0], distance: 15};
  const end: Framing = {look: close.look, distance: close.distance - 0.03 * (durationInFrames / fps)};
  const pre = glideIn > 0 ? {from: far, hold: 0, move: Math.round(glideIn * fps), ease: 'cubic' as const} : undefined;

  const mats = useMemo(() => {
    const std = (c: string, r = 0.8) => new THREE.MeshStandardMaterial({color: raw(c), roughness: r, metalness: 0});
    return {
      cut: cutMaterial(),
      sky: new THREE.MeshBasicMaterial({map: skyTexture(mood), fog: false}),
      body: std(m.device, 0.45),
      inside: std(mood === 'night' ? '#454c58' : '#6b727d', 0.9),
      board: std(mood === 'night' ? '#2f3a37' : '#3c4a45', 0.7),
      battery: std('#9aa1ad', 0.6),
      part: std('#c3c8cf', 0.5),
      chip: std('#1d1f24', 0.4),
      glass: new THREE.MeshStandardMaterial({color: raw(m.device), roughness: 0.3, transparent: true}),
      glow: new THREE.MeshBasicMaterial({color: raw(section.screenLight), transparent: true, opacity: 0}),
      // a fixed pool: 3 live waves × 3 arcs, and the 7 bars of the "Hey…" wave
      waves: new Array(9)
        .fill(0)
        .map(() => new THREE.MeshBasicMaterial({color: raw(m.ink), transparent: true, depthWrite: false})),
      bars: new Array(7)
        .fill(0)
        .map(() => new THREE.MeshBasicMaterial({color: raw(m.ink), transparent: true, depthWrite: false})),
      icon: new THREE.MeshBasicMaterial({transparent: true, depthWrite: false}),
      ink: new THREE.MeshBasicMaterial({color: raw(m.ink)}),
      slot: new THREE.MeshBasicMaterial({color: raw('#08090b')}),
      bars13: new Array(HEY_BARS.length)
        .fill(0)
        .map(() => new THREE.MeshBasicMaterial({color: raw(m.ink), transparent: true, depthWrite: false})),
    };
  }, [m, mood]);
  mats.sky.color.setScalar(1 / m.exposure);

  // realism: the live screen under the glass, drawn on a canvas of the display's shape
  const display = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 720;
    c.height = Math.round((720 * REAL_DISPLAY.h) / REAL_DISPLAY.w);
    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = 8;
    // a lit screen is a light source: brighter than the lit surfaces round it, still under the
    // post pass's roll-off (no clipped white)
    return {
      c,
      tex,
      key: '',
      mat: new THREE.MeshBasicMaterial({map: tex, color: new THREE.Color(1.3, 1.3, 1.3), toneMapped: false}),
    };
  }, []);
  const screenState = realism
    ? screenStateAt(screen, t, {
        mood,
        clock: clock ?? (mood === 'night' ? '9:47' : '7:58'),
        date: date ?? (mood === 'night' ? 'Tuesday, October 14' : 'Wednesday, October 15'),
      })
    : null;

  // the front comes off (slides toward the camera and fades)
  const off = ease(t, cutAt, cutAt + 0.6);
  const front = realism ? REAL_FRONT : FRONT;
  mats.glass.opacity = 1 - off;

  // waves: every `waveEvery` from `wavesAt`, each travels from the room (left) to the chip in 1.6 s
  const TRAVEL = 1.6;
  const startX = -2.6;
  const waves: {x: number; s: number; a: number}[] = [];
  if (t >= wavesAt) {
    const n = Math.floor((t - wavesAt) / waveEvery);
    for (let k = Math.max(0, n - 2); k <= n; k++) {
      const born = wavesAt + k * waveEvery;
      if (wakeAt !== undefined && Math.abs(born - wakeAt) < waveEvery / 2) continue; // the "Hey…" wave takes this slot
      const u = (t - born) / TRAVEL;
      if (u < 0 || u > 1.25) continue;
      const x = startX + (CHIP[0] - startX) * Math.min(1, u);
      // discarded: shrinks and fades into the chip
      const fade = u <= 1 ? Math.min(1, u / 0.15) : Math.max(0, 1 - (u - 1) / 0.25);
      waves.push({x, s: 0.3 * (u <= 1 ? 1 : 1 - (u - 1) / 0.25), a: 0.85 * fade});
    }
  }
  const hey = wakeAt === undefined ? -1 : (t - wakeAt) / (TRAVEL * 0.8);
  const heyX = startX + (CHIP[0] - startX) * Math.min(1, Math.max(0, hey));
  const heyIn = hey >= 0 && hey < 1.15;
  const lit = wakeAt === undefined ? 0 : ease(t, wakeAt + TRAVEL * 0.8, wakeAt + TRAVEL * 0.8 + 0.3);
  mats.glow.opacity = lit;

  // the hatch toward the network: shut (a closed flap with its lock); opens only if asked
  const doorOpen = !doorShut && doorOpenAt !== undefined ? ease(t, doorOpenAt, doorOpenAt + 0.5) : 0;

  const top = PH.y + PH.h / 2;
  const iw = PH.w - 2 * RIM;
  const ih = PH.h - 2 * RIM;
  const rimRects: [V3, V3][] = [
    [
      [-PH.w / 2, PH.y - PH.h / 2, FRONT],
      [PH.w / 2, PH.y + PH.h / 2, FRONT],
    ],
    [
      [-iw / 2, PH.y - ih / 2, FRONT + 0.001],
      [iw / 2, PH.y + ih / 2, FRONT + 0.001],
    ],
  ];

  // the chip's callout: anchored on the chip as the camera sees it when the label comes in
  const labelAt = Math.round((chipLabelAt ?? cutAt + 0.8) * fps);
  const chipPx = projectToFrame(
    sectionCameraAt({
      from: close,
      to: end,
      pre,
      frame: Math.max(frame, labelAt),
      fps,
      durationInFrames,
      drift,
      clockOffset: startFrame / fps,
    }),
    [CHIP[0], PH.y + WAKE_CHIP[1], WAKE_CHIP[2]],
  );
  const phoneTopPx = projectToFrame(
    sectionCameraAt({
      from: close,
      to: end,
      pre,
      frame: Math.max(frame, labelAt),
      fps,
      durationInFrames,
      drift,
      clockOffset: startFrame / fps,
    }),
    [CHIP[0], top + 0.02, 0],
  );

  return (
    <AbsoluteFill>
      <SectionStage mood={mood} post={{focusY: 0.45}} ao={ao ?? realism}>
        <SectionCamera
          from={close}
          to={end}
          pre={pre}
          durationInFrames={durationInFrames}
          drift={drift}
          clockOffset={startFrame / fps}
        />
        <SectionLights mood={mood} target={[0, 1.2, 0]} lamp={0} />
        <mesh position={[0, 6, -9]} material={mats.sky}>
          <planeGeometry args={[40, 30]} />
        </mesh>

        {/* the cut plinth it stands on */}
        <mesh position={[0, 0.1, 0]} material={mats.cut} castShadow receiveShadow>
          <boxGeometry args={[1.7, 0.2, 1.0]} />
        </mesh>
        <CutOutline
          rects={[
            [
              [-0.85, 0, 0.5],
              [0.85, 0.2, 0.5],
            ],
            [
              [-0.85, 0.2, -0.5],
              [0.85, 0.2, 0.5],
            ],
            [
              [0.85, 0, -0.5],
              [0.85, 0.2, 0.5],
            ],
          ]}
        />
        <BlobShadow position={[0, 0.205, 0]} size={[1.4, 0.6]} opacity={0.3} />

        {realism ? (
          <>
            {/* a contact shadow tight under the phone's foot (the blob above is the soft one) */}
            <BlobShadow position={[0, 0.206, 0.0]} size={[1.05, 0.22]} opacity={0.45} />
            {screenState ? <PaintScreen target={display} state={screenState} /> : null}
            <RealPhone
              position={[0, PH.y, 0]}
              rotation={[0, yaw, 0]}
              open={off}
              display={display.mat}
              shutter={doorOpen}
              shutterX={SHUTTER_X}
            >
              <PhoneTeardown chipLit={lit} />
            </RealPhone>
          </>
        ) : (
          <>
            {/* the phone: back shell, its cut rim (hatched, ink edges), the inside */}
            <mesh
              geometry={roundedBox(PH.w, PH.h, PH.d, 0.09, 5)}
              material={mats.body}
              position={[0, PH.y, -0.012]}
              castShadow
              receiveShadow
            />
            {/* the cut face round the opening: four hatched strips */}
            {[
              {p: [0, PH.y + PH.h / 2 - RIM / 2, FRONT], s: [PH.w, RIM]},
              {p: [0, PH.y - PH.h / 2 + RIM / 2, FRONT], s: [PH.w, RIM]},
              {p: [-PH.w / 2 + RIM / 2, PH.y, FRONT], s: [RIM, ih]},
              {p: [PH.w / 2 - RIM / 2, PH.y, FRONT], s: [RIM, ih]},
            ].map((f, i) => (
              <mesh key={i} position={f.p as V3} material={mats.cut} receiveShadow>
                <planeGeometry args={f.s as [number, number]} />
              </mesh>
            ))}
            <CutOutline rects={rimRects} />
            <mesh position={[0, PH.y, FRONT - 0.075]} material={mats.inside} receiveShadow>
              <planeGeometry args={[iw, ih]} />
            </mesh>
            {/* board, battery, small parts, the listening chip */}
            <mesh
              geometry={roundedBox(iw - 0.08, ih * 0.42, 0.03, 0.01)}
              material={mats.board}
              position={[0, PH.y + ih * 0.24, FRONT - 0.03]}
              castShadow
              receiveShadow
            />
            <mesh
              geometry={roundedBox(iw - 0.12, ih * 0.44, 0.07, 0.03, 5)}
              material={mats.battery}
              position={[0, PH.y - ih * 0.24, FRONT - 0.045]}
              castShadow
              receiveShadow
            />
            {[
              [-0.22, 1.72],
              [-0.12, 1.5],
              [0.32, 1.48],
              [-0.28, 1.45],
              [0.3, 1.78],
            ].map(([x, y], i) => (
              <mesh
                key={i}
                geometry={roundedBox(0.07, 0.05, 0.03, 0.008)}
                material={mats.part}
                position={[x, y, FRONT - 0.012]}
                castShadow
              />
            ))}
            <mesh
              geometry={roundedBox(0.17, 0.17, 0.04, 0.01)}
              material={mats.chip}
              position={[CHIP[0], CHIP[1], FRONT - 0.01]}
              castShadow
            />
            <mesh position={[CHIP[0], CHIP[1], FRONT + 0.012]} material={mats.glow} visible={lit > 0.01}>
              <planeGeometry args={[0.13, 0.13]} />
            </mesh>

            {/* the front (screen and glass): comes off toward the camera */}
            <mesh
              geometry={roundedBox(PH.w - 0.02, PH.h - 0.02, 0.04, 0.08, 5)}
              material={mats.glass}
              position={[0, PH.y, FRONT + 0.02 + off * 0.6]}
              visible={off < 0.99}
              castShadow
            />
          </>
        )}
        <pointLight
          position={[CHIP[0], CHIP[1], front + 0.25]}
          color={raw(section.screenLight)}
          intensity={(realism ? 0.25 : 0.35) * lit}
          distance={1.2}
          decay={2}
        />

        {realism ? (
          // realism: the shutter is part of the phone (RealPhone `shutter`); the network is a drawing
          // annotation tied to it: an ink elbow leader (up, then left) to a line icon of a cloud and a
          // shut padlock
          <group position={[SHUTTER_X, top, 0]}>
            <mesh material={mats.ink} position={[0, 0.012 + LEADER.up / 2, 0]}>
              <boxGeometry args={[LEADER.t, LEADER.up, LEADER.t]} />
            </mesh>
            <mesh material={mats.ink} position={[-LEADER.across / 2, 0.012 + LEADER.up, 0]}>
              <boxGeometry args={[LEADER.across + LEADER.t, LEADER.t, LEADER.t]} />
            </mesh>
            <NetworkGlyph ink={m.ink} mat={mats.icon} position={[-LEADER.across - 0.22, 0.012 + LEADER.up + 0.02, 0]} />
          </group>
        ) : (
          <>
            {/* the hatch toward the network, on the top edge, and the cloud with its lock above */}
            <group position={[0, top, 0]}>
              <mesh position={[0, 0.03 + 0.06 * doorOpen, 0]} rotation={[0, 0, -0.9 * doorOpen]} material={mats.chip}>
                <boxGeometry args={[0.26, 0.05, 0.12]} />
              </mesh>
              <CutOutline
                rects={[
                  [
                    [-0.13, 0.055, 0.06],
                    [0.13, 0.005, 0.06],
                  ],
                ]}
              />
              <NetworkIcon ink={m.ink} mat={mats.icon} />
            </group>
          </>
        )}
        {realism ? (
          <>
            {/* sound waves as a fine ink diagram: thin concentric arcs drifting in, fading into the chip */}
            {waves.map((w, i) =>
              [0, 1, 2].map((r) => {
                const mat = mats.waves[(i % 3) * 3 + r];
                mat.opacity = w.a * (0.9 - r * 0.25);
                return (
                  <mesh
                    key={`${i}-${r}`}
                    geometry={ARC_FINE}
                    material={mat}
                    position={[w.x - r * 0.07, CHIP[1], front + 0.15]}
                    rotation={[0, 0, -Math.PI * 0.3]}
                    scale={w.s * (1 + r * 0.32)}
                  />
                );
              }),
            )}
            {/* the "Hey…" wave: a waveform glyph of thin rounded bars that lights the chip */}
            {heyIn
              ? HEY_BARS.map((hgt, i) => {
                  const fade = hey <= 1 ? Math.min(1, hey / 0.12) : Math.max(0, 1 - (hey - 1) / 0.15);
                  const mat = mats.bars13[i];
                  mat.opacity = fade;
                  return (
                    <mesh
                      key={i}
                      geometry={BAR}
                      material={mat}
                      position={[heyX - 0.4 + i * 0.03, CHIP[1], front + 0.18]}
                      scale={[1, Math.max(0.05, hgt * (hey <= 1 ? 1 : 1 - (hey - 1) / 0.15)), 1]}
                    />
                  );
                })
              : null}
          </>
        ) : (
          <>
            {/* sound waves from the room: arcs drifting to the chip, fading as they arrive (discarded) */}
            {waves.map((w, i) =>
              [0, 1, 2].map((r) => {
                const mat = mats.waves[(i % 3) * 3 + r];
                mat.opacity = w.a * (1 - r * 0.25);
                return (
                  <mesh
                    key={`${i}-${r}`}
                    geometry={ARC}
                    material={mat}
                    position={[w.x - r * 0.08, CHIP[1], front + 0.15]}
                    rotation={[0, 0, -Math.PI * 0.275]}
                    scale={w.s * (1 + r * 0.35)}
                  />
                );
              }),
            )}
            {/* the "Hey…" wave: a word-shaped run of bars that lights the chip when it arrives */}
            {heyIn
              ? [0.35, 0.8, 1, 0.6, 0.9, 0.45, 0.25].map((hgt, i) => {
                  const fade = hey <= 1 ? Math.min(1, hey / 0.12) : Math.max(0, 1 - (hey - 1) / 0.15);
                  const mat = mats.bars[i];
                  mat.opacity = fade;
                  return (
                    <mesh
                      key={i}
                      material={mat}
                      position={[heyX - 0.36 + i * 0.06, CHIP[1], front + 0.18]}
                      scale={[1, hgt * (hey <= 1 ? 1 : 1 - (hey - 1) / 0.15), 1]}
                    >
                      <planeGeometry args={[0.03, 0.26]} />
                    </mesh>
                  );
                })
              : null}
          </>
        )}
      </SectionStage>
      {realism && chipLabel && labelAt < durationInFrames ? (
        <Sequence from={labelAt} layout="none">
          <Callout
            mood={mood}
            title={chipLabel}
            x={chipPx[0] / 1080}
            y={chipPx[1] / 1920}
            place="above"
            dx={0}
            dy={phoneTopPx[1] - chipPx[1] - 70}
          />
        </Sequence>
      ) : null}
    </AbsoluteFill>
  );
};
