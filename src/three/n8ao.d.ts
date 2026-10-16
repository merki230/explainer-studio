// Minimal types for n8ao (it ships none): only what MuseumPost uses.
declare module 'n8ao' {
  import type * as THREE from 'three';
  export class N8AOPass {
    constructor(scene: THREE.Scene, camera: THREE.Camera, width?: number, height?: number);
    configuration: {
      aoRadius: number;
      distanceFalloff: number;
      intensity: number;
      color: THREE.Color;
      aoSamples: number;
      denoiseSamples: number;
      denoiseRadius: number;
      halfRes: boolean;
      depthAwareUpsampling: boolean;
      gammaCorrection: boolean;
      screenSpaceRadius: boolean;
      renderMode: number;
      colorMultiply: boolean;
      transparencyAware: boolean;
      accumulate: boolean;
    };
    renderToScreen: boolean;
    scene: THREE.Scene;
    camera: THREE.Camera;
    setSize(width: number, height: number): void;
    render(
      renderer: THREE.WebGLRenderer,
      writeBuffer: THREE.WebGLRenderTarget | null,
      readBuffer: THREE.WebGLRenderTarget | null,
    ): void;
  }
}
