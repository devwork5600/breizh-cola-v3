"use client";

import { useEffect } from "react";

import { CanLighting } from "@/components/experience/cans/CanLighting";
import FloatingCan from "@/components/experience/cans/FloatingCan";
import { Breakpoint, useBreakpoint } from "@/lib/useBreakpoint";

// Hero's text switches from centered (mobile) to left-aligned with room for
// the can on the right (xl:items-start) - the can needs to make that same
// jump so it doesn't sit centered behind the text on desktop.
const CAN_LAYOUT_BY_BREAKPOINT: Record<
  Breakpoint,
  { scale: number; position: [number, number, number] }
> = {
  xs: { scale: 0.55, position: [0, -0.7, 0] },
  sm: { scale: 0.65, position: [0, -0.65, 0] },
  md: { scale: 0.68, position: [0, -0.65, 0] },
  lg: { scale: 0.68, position: [0, -0.65, 0] },
  xl: { scale: 0.95, position: [1.3, -0.2, 0] },
  xxl: { scale: 1, position: [1.7, -0.1, 0] },
};

export default function Scene({ onReady }: { onReady?: () => void }) {
  const breakpoint = useBreakpoint();
  const { scale, position } = CAN_LAYOUT_BY_BREAKPOINT[breakpoint];

  // Fires only once the suspended can mesh/textures above have actually
  // resolved and this subtree has committed, so it's a reliable "safe to
  // reveal now" signal for Hero's intro timeline.
  useEffect(() => {
    onReady?.();
  }, [onReady]);

  return (
    <group>
      <FloatingCan flavor="original" scale={scale} position={position} />
      <CanLighting />
    </group>
  );
}
