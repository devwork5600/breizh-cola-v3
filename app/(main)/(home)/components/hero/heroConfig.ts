import { Breakpoint } from "@/lib/useBreakpoint";

type Position = { x?: number; y?: number; z?: number };
type CanTransform = { position: Position; rotation?: Position; scale?: number };

export interface HeroBreakpointConfig {
  introCan1: { from: CanTransform; to: CanTransform };
  finalCan1: { position: Position; scale: number };
  scrollGroupRotationY: number;
  scrollCan1: { position: Position; rotation?: Position };
  scrollCan2: { from: CanTransform; to: CanTransform };
  scrollCan3: { from: CanTransform; to: CanTransform };
}

// Per-breakpoint transforms for the hero's 3 cans: can1 (original) slides in
// on the intro timeline, then can1/can2/can3 fly into their resting spots as
// the hero section scrolls past, with the whole group rotating. Values
// mirror the reference's CONFIG.hero per breakpoint.
export const HERO_CONFIG: Record<Breakpoint, HeroBreakpointConfig> = {
  xs: {
    introCan1: {
      from: { position: { x: 5, y: -0.7 }, scale: 0.55 },
      to: { position: { x: 0, y: -0.7 }, rotation: { z: 0 } },
    },
    finalCan1: { position: { x: 0, y: -0.7 }, scale: 0.55 },
    scrollGroupRotationY: Math.PI * 2,
    scrollCan1: { position: { x: 0, y: -0.7 }, rotation: { z: 0 } },
    scrollCan2: {
      from: { position: { x: 0, y: -4, z: -0.5 }, scale: 0.5 },
      to: {
        position: { x: 0.25, y: -0.78, z: -0.5 },
        rotation: { z: -0.3 },
        scale: 0.5,
      },
    },
    scrollCan3: {
      from: { position: { x: -0.25, y: 4, z: -0.4 }, scale: 0.5 },
      to: {
        position: { x: -0.25, y: -0.74, z: -0.4 },
        rotation: { z: 0.3 },
        scale: 0.5,
      },
    },
  },
  sm: {
    introCan1: {
      from: { position: { x: 5, y: -0.7 }, scale: 0.65 },
      to: { position: { x: 0, y: -0.7 }, rotation: { z: 0 } },
    },
    finalCan1: { position: { x: 0, y: -0.7 }, scale: 0.65 },
    scrollGroupRotationY: Math.PI * 2,
    scrollCan1: { position: { x: 0, y: -0.65 }, rotation: { z: 0 } },
    scrollCan2: {
      from: { position: { x: 0, y: -4, z: -0.5 }, scale: 0.57 },
      to: {
        position: { x: 0.33, y: -0.78, z: -0.5 },
        rotation: { z: -0.3 },
        scale: 0.57,
      },
    },
    scrollCan3: {
      from: { position: { x: -0.25, y: 4, z: -0.4 }, scale: 0.57 },
      to: {
        position: { x: -0.33, y: -0.74, z: -0.4 },
        rotation: { z: 0.3 },
        scale: 0.57,
      },
    },
  },
  md: {
    introCan1: {
      from: { position: { x: 4, y: -0.65 }, scale: 0.68 },
      to: { position: { x: 0, y: -0.65 }, rotation: { z: 0 } },
    },
    finalCan1: { position: { x: 0, y: -0.65 }, scale: 0.68 },
    scrollGroupRotationY: Math.PI * 2,
    scrollCan1: { position: { x: 0, y: -0.6 }, rotation: { z: 0 } },
    scrollCan2: {
      from: { position: { x: 0, y: -4, z: -0.5 }, scale: 0.6 },
      to: {
        position: { x: 0.43, y: -0.78, z: -0.5 },
        rotation: { z: -0.3 },
        scale: 0.6,
      },
    },
    scrollCan3: {
      from: { position: { x: -0.25, y: 4, z: -0.4 }, scale: 0.6 },
      to: {
        position: { x: -0.4, y: -0.74, z: -0.4 },
        rotation: { z: 0.3 },
        scale: 0.6,
      },
    },
  },
  lg: {
    introCan1: {
      from: { position: { x: 4, y: -0.65 }, scale: 0.68 },
      to: { position: { x: 0, y: -0.65 }, rotation: { z: 0 } },
    },
    finalCan1: { position: { x: 0, y: -0.65 }, scale: 0.68 },
    scrollGroupRotationY: Math.PI * 2,
    scrollCan1: { position: { x: 0, y: -0.6 }, rotation: { z: 0 } },
    scrollCan2: {
      from: { position: { x: 0, y: -4, z: -0.5 }, scale: 0.6 },
      to: {
        position: { x: 0.43, y: -0.78, z: -0.5 },
        rotation: { z: -0.3 },
        scale: 0.6,
      },
    },
    scrollCan3: {
      from: { position: { x: -0.25, y: 4, z: -0.4 }, scale: 0.6 },
      to: {
        position: { x: -0.4, y: -0.74, z: -0.4 },
        rotation: { z: 0.3 },
        scale: 0.6,
      },
    },
  },
  xl: {
    introCan1: {
      from: { position: { x: 4, y: 0 }, scale: 0.95 },
      to: { position: { x: 1.2, y: -0.2 }, rotation: { y: -0.1 } },
    },
    finalCan1: { position: { x: 1.3, y: -0.2 }, scale: 0.95 },
    scrollGroupRotationY: Math.PI * 2,
    scrollCan1: { position: { x: 1.3 }, rotation: { z: 0 } },
    scrollCan2: {
      from: { position: { x: 0, y: -4, z: -0.5 }, scale: 0.75 },
      to: {
        position: { x: 2.1, y: 0, z: -0.8 },
        rotation: { z: -0.3 },
        scale: 0.75,
      },
    },
    scrollCan3: {
      from: { position: { x: -1.5, y: 4, z: -0.4 }, scale: 0.75 },
      to: {
        position: { x: 0.8, y: 0, z: -0.5 },
        rotation: { z: 0.3 },
        scale: 0.75,
      },
    },
  },
  xxl: {
    introCan1: {
      from: { position: { x: 3.2, y: -0.1 }, scale: 1 },
      to: { position: { x: 1.7, y: -0.1 } },
    },
    finalCan1: { position: { x: 1.7, y: -0.1 }, scale: 1 },
    scrollGroupRotationY: Math.PI * 2,
    scrollCan1: { position: { x: 1.4 }, rotation: { z: 0 } },
    scrollCan2: {
      from: { position: { x: 0, y: -4, z: -0.5 }, scale: 0.85 },
      to: {
        position: { x: 2.2, y: 0, z: -0.8 },
        rotation: { z: -0.3 },
        scale: 0.85,
      },
    },
    scrollCan3: {
      from: { position: { x: -1.5, y: 4, z: -0.4 }, scale: 0.85 },
      to: {
        position: { x: 0.9, y: 0, z: -0.5 },
        rotation: { z: 0.3 },
        scale: 0.85,
      },
    },
  },
};
