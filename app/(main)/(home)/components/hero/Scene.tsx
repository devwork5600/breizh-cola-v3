"use client";

import { CanLighting } from "@/components/experience/cans/CanLighting";
import FloatingCan from "@/components/experience/cans/FloatingCan";

export default function Scene() {
  return (
    <group>
      <FloatingCan flavor="original" />
      <CanLighting />
    </group>
  );
}
