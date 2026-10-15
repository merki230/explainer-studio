import {config} from '@remotion/eslint-config-flat';

export default [
  {ignores: ['node_modules', 'out', 'build', '.yarn']},
  // Remotion's rules (no Math.random, no native media tags, ...).
  ...config,
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      // Frames must be pure functions of useCurrentFrame(): R3F's useFrame
      // animates on wall-clock time and renders differently every time.
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@react-three/fiber',
              importNames: ['useFrame'],
              message: 'Drive motion from useCurrentFrame() instead.',
            },
          ],
        },
      ],
      'no-restricted-properties': [
        'error',
        {object: 'Date', property: 'now', message: 'Derive time from useCurrentFrame().'},
      ],
    },
  },
  {
    // Node scripts: globals like process and console are fine here.
    files: ['scripts/**', '*.config.*'],
    rules: {'no-undef': 'off'},
  },
];
