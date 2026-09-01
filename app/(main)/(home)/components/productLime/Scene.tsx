"use client";

import { CanLighting } from "@/components/experience/cans/CanLighting";
import FloatingCan from "@/components/experience/cans/FloatingCan";

export default function Scene() {
  return (
    <group rotation={[0, 0, 0.19]}>
      <FloatingCan
        flavor="lime"
        position={[-0.3, -0.5, 0]}
        scale={0.75}
        rotationIntensity={1}
        floatIntensity={0.5}
        floatSpeed={2}
      />
      <directionalLight position={[0, 0, 5]} intensity={0.7} castShadow />
      <CanLighting />
    </group>
  );
}
