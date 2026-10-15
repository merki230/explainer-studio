import {Config} from '@remotion/cli/config';

Config.setEntryPoint('src/index.ts');
Config.setVideoImageFormat('jpeg');
// WebGL in headless Chrome: 'angle' is the most reliable for three.js scenes.
Config.setChromiumOpenGlRenderer('angle');
// Render 3D scenes one tab at a time if your machine runs out of GPU memory:
// Config.setConcurrency(1);
