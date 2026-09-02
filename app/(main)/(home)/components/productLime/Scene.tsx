"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { Group } from "three";

import { CanLighting } from "@/components/experience/cans/CanLighting";
import FloatingCan from "@/components/experience/cans/FloatingCan";
import { Breakpoint } from "@/lib/useBreakpoint";
import { useResponsiveStore } from "@/store/useResponsiveStore";

gsap.registerPlugin(ScrollTrigger);

// Mirrored from ProductCherry's x per breakpoint: this section's text is
// right-aligned (centered on mobile, right-anchored from xl: - see
// ProductLime.tsx), so the can sits slightly right of center below xl:
// and fully on the left at xl:+, instead of Cherry's left/right.
const CAN_LAYOUT_BY_BREAKPOINT: Record<
  Breakpoint,
  { scale: number; position: [number, number, number] }
> = {
  xs: { scale: 0.65, position: [0, -0.4, 0] },
  sm: { scale: 0.75, position: [0.3, -0.4, 0] },
  md: { scale: 0.75, position: [0.3, -0.5, 0] },
  lg: { scale: 0.75, position: [0.3, -0.5, 0] },
  xl: { scale: 0.9, position: [-1.5, 0.35, 0] },
  xxl: { scale: 0.95, position: [-1.6, 0.35, 0] },
};

export default function Scene() {
  const canRef = useRef<Group>(null);
  const breakpoint = useResponsiveStore((s) => s.breakpoint);
  const isReady = useResponsiveStore((s) => s.isReady);
  const { scale, position } = CAN_LAYOUT_BY_BREAKPOINT[breakpoint];

  useGSAP(
    () => {
      if (!canRef.current || !isReady) return;

      // Defensive cleanup matching the hero/product Scenes: avoids a
      // stray duplicate ScrollTrigger surviving a breakpoint change or a
      // React StrictMode dev double-invoke.
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.trigger === ".product-lime") t.kill();
      });

      gsap.set(canRef.current.position, {
        x: position[0],
        y: position[1],
        z: position[2],
      });

      // The pop-in only plays once per session (not once per mount): a
      // route revisit or a breakpoint-driven rebuild shouldn't replay it,
      // it should just land the can directly at its resting scale.
      const hasPlayedBefore =
        typeof window !== "undefined" &&
        sessionStorage.getItem("productLimeAnimPlayed") === "true";

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".product-lime",
          start: "top 20%",
        },
      });

      if (!hasPlayedBefore) {
        scrollTl.fromTo(
          canRef.current.scale,
          { x: 0, y: 0, z: 0 },
          {
            x: scale,
            y: scale,
            z: scale,
            duration: 0.3,
            ease: "back.out(1.7)",
            onComplete: () => {
              sessionStorage.setItem("productLimeAnimPlayed", "true");
            },
          }
        );
      } else {
        gsap.set(canRef.current.scale, { x: scale, y: scale, z: scale });
      }
    },
    { dependencies: [breakpoint, isReady] }
  );

  return (
    <group rotation={[0, 0, 0.19]}>
      <FloatingCan
        ref={canRef}
        flavor="lime"
        rotationIntensity={1}
        floatIntensity={0.5}
        floatSpeed={2}
      />
      <directionalLight position={[0, 0, 5]} intensity={0.7} castShadow />
      <CanLighting />
    </group>
  );
}
