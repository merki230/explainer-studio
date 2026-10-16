import {registerRoot} from 'remotion';
import {BrandRoot} from './BrandRoot';

// Separate entry point for the brand stills (not the videos): see src/brand/export.ts.
registerRoot(BrandRoot);
