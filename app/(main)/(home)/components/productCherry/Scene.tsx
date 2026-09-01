"use client";

import { CanLighting } from "@/components/experience/cans/CanLighting";
import FloatingCan from "@/components/experience/cans/FloatingCan";
import { Breakpoint, useBreakpoint } from "@/lib/useBreakpoint";

// Text switches from a centered mobile stack to a left-aligned desktop
// layout at xl: (see ProductCherry.tsx) - the can needs to move out from
// behind the centered text to sit beside it once that happens.
const CAN_LAYOUT_BY_BREAKPOINT: Record<
  Breakpoint,
  { scale: number; position: [number, number, number] }
> = {
  xs: { scale: 0.65, position: [0, -0.4, 0] },
  sm: { scale: 0.75, position: [-0.3, -0.4, 0] },
  md: { scale: 0.75, position: [-0.3, -0.5, 0] },
  lg: { scale: 0.75, position: [-0.3, -0.5, 0] },
  xl: { scale: 0.9, position: [1.5, 0.35, 0] },
  xxl: { scale: 0.95, position: [1.6, 0.35, 0] },
};

export default function Scene() {
  const breakpoint = useBreakpoint();
  const { scale, position } = CAN_LAYOUT_BY_BREAKPOINT[breakpoint];

  return (
    <group rotation={[0, 0, -0.22]}>
      <FloatingCan
        flavor="cherry"
        position={position}
        scale={scale}
        rotationIntensity={1}
        floatIntensity={0.5}
        floatSpeed={2}
      />
      <directionalLight position={[0, 0, 5]} intensity={0.7} castShadow />
      <CanLighting />
    </group>
  );
}
