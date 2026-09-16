"use client";

import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import { Group } from "three";

import { useMenuStore, useSidebarCanStore } from "@/store/useMenuStore";

import { CanLighting } from "../cans/CanLighting";
import FloatingCan from "../cans/FloatingCan";

const SPACING = 4; // distance between cans in world units

export default function SideMenuScene() {
  const containerRef = useRef<Group>(null);

  const activeCan = useSidebarCanStore((s) => s.activeCan);
  const isMenuOpen = useMenuStore((s) => s.isMenuOpen);

  useEffect(() => {
    if (!containerRef.current) return;

    gsap.to(containerRef.current.position, {
      y: -activeCan * SPACING,
      duration: 1.2,
      ease: "power4.out",
    });
  }, [activeCan]);

  // Canvas runs frameloop="demand" (SideMenuCanvas.tsx). Every can here is
  // wrapped in drei's <Float>, which animates continuously on its own
  // internal useFrame for as long as it's mounted — there's no hook into
  // that to invalidate only while it's actually moving. Gating on
  // isMenuOpen instead of invalidating unconditionally is what actually
  // saves anything: the canvas sits fully idle while the menu is closed
  // (nearly always) instead of rendering forever for an off-screen scene.
  useFrame(({ invalidate }) => {
    if (isMenuOpen) invalidate();
  });

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
