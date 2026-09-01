"use client";

import { Environment } from "@react-three/drei";

// Every scene that renders a SodaCan uses this same ambient/environment
// balance - it's what keeps the studio HDRI actually driving the visible
// reflections instead of getting washed out by flat ambient light.
export function CanLighting() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <Environment
        preset="studio"
        background={false}
        environmentIntensity={0.7}
      />
    </>
  );
}
