import {CHARGE, RACE} from '../../theme';
import type {VideoSpec} from '../../types';

/**
 * TEMPORARY scene-builder test spec (No. 011 builds N1–N6). The director replaces it after the voice.
 * Scenes start at the estimated transcript's times; each one exercises a build.
 */
// eslint-disable-next-line @remotion/non-pure-animation
const SLIDE = {transition: 'slide'} as const;
// eslint-disable-next-line @remotion/non-pure-animation
const CUT = {transition: 'cut'} as const;
const FOOT = [
  'Different BYD models. Cost: 2023 estimate.',
  'Price: China list, cheapest trim.',
];

export const spec: VideoSpec = {
  tail: 1.5,
  scenes: [
    {
      // N5 a, c, d: plain bays, a sedan in the bottom bay, drivers without chargers
      scene: 'charge-slice',
      start: 0,
      props: {
        region: 'china',
        canopy: false,
        bayPaint: false,
        chargers: false,
        framing: 'stack',
        camera: {from: {look: [0.9, 2.45, 0.6], distance: 42}, to: {look: [0.9, 2.45, 0.6], distance: 40}},
        top: {arrive: {at: 1.2, from: 2.2, for: 1.6}, driver: {keys: [{at: 2.0, do: 'exit'}, {at: 3.0, do: 'walkTo', to: [-2.6, 1.3]}]}},
        bottom: {
          car: {shape: 'sedan'},
          driver: {start: 'curb', keys: [{at: -1, do: 'sit'}, {at: 4.4, do: 'stand'}, {at: 4.9, do: 'walkTo', to: 'door'}]},
        },
      },
      overlays: [
        {type: 'tag', who: 'you', anchor: 'top:top', label: 'BYD', color: CHARGE.bydPaint, outline: 'ink', side: 'left', at: 0.3, until: 3.8},
        {type: 'tag', who: 'you', anchor: 'top:bottom', label: 'TESLA', color: CHARGE.teslaPaint, outline: 'ink', side: 'left', below: 'under:top', at: 0.3, until: 3.8},
      ],
    },
    {
      // N1: the sedan comes apart, the scan, the glow wave, the dim, a surge
      scene: 'teardown-slice',
      start: 6.2,
      props: {
        ...SLIDE,
        apart: {at: 0.9},
        scan: [{at: 2.2}],
        glow: [{at: 3.1, groups: ['pack']}, {at: 3.5, wave: 1.9}],
        dimAt: 5.4,
        surge: [{at: 6.0, groups: ['pack']}],
        push: 0.25,
      },
    },
    {
      // N1: the pack tile close, the focus, the lift
      scene: 'teardown-slice',
      start: 14.27,
      props: {
        ...CUT,
        framing: 'pack',
        glow: [{at: -5, groups: ['pack']}, {at: -4.6, wave: 1.9}],
        dimAt: -3,
        focus: [{at: 0.3}].map((f) => ({...f, groups: ['pack' as const]})),
        lift: [{at: 1.5}],
        push: 0.1,
      },
    },
    {
      // N4 + N5 b: the Tesla's pack, cells bought in by crate
      scene: 'charge-slice',
      start: 22.46,
      props: {
        ...SLIDE,
        region: 'china',
        canopy: false,
        bayPaint: false,
        chargers: false,
        framing: 'bottomPack',
        push: 0.1,
        bottom: {
          car: {shape: 'sedan'},
          bought: {
            crates: [
              {in: 0.8, drops: [2.0, 2.6, 3.2], out: 4.9},
              {in: 5.0, drops: [5.6, 6.0, 6.4]},
            ],
          },
        },
      },
      overlays: [{type: 'callout', anchor: 'crate:bottom', title: 'CELLS', sub: 'Bought in', at: 3.0, until: 4.6}],
    },
    {
      // N3 + N5 b: the blade pack grows, one blade slides out, the lid becomes the floor
      scene: 'charge-slice',
      start: 28.98,
      props: {
        ...CUT,
        region: 'china',
        canopy: false,
        bayPaint: false,
        chargers: false,
        framing: 'topPack',
        push: 0.05,
        top: {car: {blade: {growAt: 0.3, growFor: 3.0, showAt: 2.6, backAt: 4.0, floorAt: 5.5}}},
        bottom: {car: {shape: 'sedan'}},
      },
      overlays: [{type: 'callout', anchor: 'blade:top', title: 'BLADE CELLS', sub: 'Made by BYD', at: 2.8, until: 4.4}],
    },
    {
      // N1 hatch + N2 glow groups
      scene: 'teardown-slice',
      start: 37.38,
      props: {
        ...SLIDE,
        dressing: 'hatch',
        scan: [{at: 0.8}],
        push: 0.15,
        car: {
          driving: [{at: -1, speed: 0.3}, {at: 5.4, speed: 1.2}],
          madeBy: {
            driveUnit: {at: 3.1},
            inverter: {at: 4.2, pulses: {at: 5.5, every: 0.3}},
            panels: {at: 6.8, stagger: 0.25},
            lamps: {at: 7.6},
          },
        },
      },
      overlays: [{type: 'tag', who: 'you', anchor: 'roof', label: 'BYD', color: RACE.evPaint, outline: 'ink', side: 'left', at: 0.4, until: 2.4}],
    },
    {
      // N6 bars card over the lit grid; the shell's cut edge glows
      scene: 'teardown-slice',
      start: 46.07,
      props: {
        ...SLIDE,
        glow: [{at: -5, groups: ['pack']}, {at: -4.6, wave: 1.9}],
        dimAt: -3,
        surge: [{at: 0.7}],
        car: {madeBy: {panels: {at: 2.0, stagger: 0}}},
        push: 0.2,
      },
      overlays: [
        {
          type: 'chart',
          at: 2.8,
          until: 13.1,
          tab: 'COST',
          footnote: FOOT,
          bars: [
            {label: 'TO BUILD · 2023 SEAL', refAt: 0.4, value: 0.85, valueAt: 0.9, bracket: {label: 'ABOUT 15% LESS', at: 1.5}},
            {label: 'TO BUY · 2026 SEAL 06', refAt: 5.1, value: 0.47, valueAt: 6.6, barLabel: 'ABOUT HALF', bracket: {label: 'PART OF THE REST', at: 7.0, measured: false, labelAt: 9.4}},
          ],
        },
      ],
    },
    {
      // N5 a in the US: the sedan below, the ghost in the empty bay
      scene: 'charge-slice',
      start: 60.99,
      props: {
        ...SLIDE,
        region: 'us',
        chargers: false,
        framing: 'twin',
        push: 0.3,
        bottom: {car: {shape: 'sedan'}, driver: {start: 'door', keys: [{at: 2.2, do: 'enter'}]}},
        ghost: {at: 0.3, shape: 'sedan'},
      },
      overlays: [{type: 'callout', anchor: 'ghost', title: 'SOFTWARE BAN', sub: 'From 2027 models', at: 5.4, until: 7.6}],
    },
  ],
};
