"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";
import { Group } from "three";

import { useSidebarCanStore } from "@/store/useMenuStore";

import { CanLighting } from "../cans/CanLighting";
import FloatingCan from "../cans/FloatingCan";

const SPACING = 4; // distance between cans in world units

export default function SideMenuScene() {
  const containerRef = useRef<Group>(null);

  const activeCan = useSidebarCanStore((s) => s.activeCan);

  useEffect(() => {
    if (!containerRef.current) return;

    gsap.to(containerRef.current.position, {
      y: -activeCan * SPACING,
      duration: 1.2,
      ease: "power4.out",
    });
  }, [activeCan]);

  return (
    <>
      <group ref={containerRef}>
        <FloatingCan
          floatSpeed={4.5}
          scale={1.5}
          flavor="original"
          position={[0, 0, 0]}
        />

        <FloatingCan
          floatSpeed={4.5}
          scale={1.5}
          flavor="zero"
          position={[0, SPACING, 0]}
        />

        <FloatingCan
          floatSpeed={4.5}
          scale={1.5}
          flavor="cherry"
          position={[0, SPACING * 2, 0]}
        />

        <FloatingCan
          floatSpeed={4.5}
          scale={1.5}
          flavor="lime"
          position={[0, SPACING * 3, 0]}
        />
        <FloatingCan
          floatSpeed={4.5}
          scale={1.5}
          flavor="coffee"
          position={[0, SPACING * 4, 0]}
        />
      </group>

      <CanLighting />
    </>
  );
}
