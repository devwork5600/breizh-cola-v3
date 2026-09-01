"use client";

import { useEffect } from "react";

import { CanLighting } from "@/components/experience/cans/CanLighting";
import FloatingCan from "@/components/experience/cans/FloatingCan";

export default function Scene({ onReady }: { onReady?: () => void }) {
  // Fires only once the suspended can mesh/textures above have actually
  // resolved and this subtree has committed, so it's a reliable "safe to
  // reveal now" signal for Hero's intro timeline.
  useEffect(() => {
    onReady?.();
  }, [onReady]);

  return (
    <group>
      <FloatingCan flavor="original" />
      <CanLighting />
    </group>
  );
}
