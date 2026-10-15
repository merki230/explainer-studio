import {useThree} from '@react-three/fiber';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {continueRender, delayRender} from 'remotion';
import * as THREE from 'three';
import {fonts, fontsReady} from '../fonts';
import {theme} from '../theme';
import {PlasterBox} from './MuseumStage';

type V3 = [number, number, number];

export type WallPlateProps = {
  /** Big serif line, e.g. "No. 014". */
  number: string;
  /** Small mono line, e.g. "THE LIVING ROOM" (letter-spaced, uppercase). */
  title: string;
  /** Centre of the plate's front face. */
  position: V3;
  /** Width, height in world units (style guide: 0.56 × 0.31). */
  size?: [number, number];
};

const TW = 512;
const TH = 280;

/**
 * Engraved wall plate (style guide § 7): a 512 × 280 texture drawn once the
 * fonts are ready (rendering waits for it), on a thin rounded plaster slab.
 * Standard material, no emissive: it takes the orange bleed like everything else.
 */
export const WallPlate: React.FC<WallPlateProps> = ({number, title, position, size = [0.56, 0.31]}) => {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);
  // While rendering, ThreeCanvas only draws on frame changes; a texture that
  // arrives later has to trigger its own draw before the frame is released.
  const advance = useThree((s) => s.advance);
  const hold = useRef<number | null>(null);
  const release = () => {
    if (hold.current !== null) continueRender(hold.current);
    hold.current = null;
  };

  useEffect(() => {
    hold.current = delayRender(`wall plate "${number}"`);
    let tex: THREE.CanvasTexture | null = null;
    let cancelled = false;
    fontsReady()
      .then(() => {
        if (cancelled) return;
        const canvas = document.createElement('canvas');
        canvas.width = TW;
        canvas.height = TH;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = theme.plate;
        ctx.fillRect(0, 0, TW, TH);
        ctx.strokeStyle = theme.plateBorder;
        ctx.lineWidth = 3;
        ctx.strokeRect(14 + 1.5, 14 + 1.5, TW - 31, TH - 31);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = theme.inkPlate;
        ctx.font = `600 86px "${fonts.serif}"`;
        ctx.fillText(number, TW / 2, 108);
        ctx.fillStyle = theme.inkPlateMuted;
        ctx.font = `500 30px "${fonts.mono}"`;
        // Letter-spaced with thin spaces (canvas letterSpacing would offset the centring).
        ctx.fillText(title.toUpperCase().split('').join('\u2009'), TW / 2, 196);
        tex = new THREE.CanvasTexture(canvas);
        // Display-referred like every museum colour (see plaster.ts).
        tex.colorSpace = THREE.LinearSRGBColorSpace;
        tex.anisotropy = 4;
        setTexture(tex);
      })
      .catch(release);
    return () => {
      cancelled = true;
      tex?.dispose();
      release();
    };
  }, [number, title]);

  const material = useMemo(
    () => (texture ? new THREE.MeshStandardMaterial({map: texture, roughness: 0.8, metalness: 0}) : null),
    [texture],
  );
  useEffect(() => () => material?.dispose(), [material]);
  // The textured plane is in the scene now: draw it, then let the frame go.
  useEffect(() => {
    if (!material) return;
    advance(performance.now());
    release();
  }, [material, advance]);

  const [x, y, z] = position;
  return (
    <group>
      <PlasterBox size={[size[0], size[1], 0.024]} radius={0.006} position={[x, y, z - 0.012]} color={theme.plate} />
      {material ? (
        <mesh position={[x, y, z + 0.0015]} material={material} receiveShadow>
          <planeGeometry args={[size[0] - 0.012, size[1] - 0.012]} />
        </mesh>
      ) : null}
    </group>
  );
};
