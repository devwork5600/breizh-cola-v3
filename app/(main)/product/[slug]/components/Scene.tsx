"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { Group } from "three";

import { CanLighting } from "@/components/experience/cans/CanLighting";
import FloatingCan from "@/components/experience/cans/FloatingCan";
import { Breakpoint, useBreakpoint } from "@/lib/useBreakpoint";

gsap.registerPlugin(ScrollTrigger);

const CAN_LAYOUT_BY_BREAKPOINT: Record<
  Breakpoint,
  { scale: number; y: number }
> = {
  xs: { scale: 0.6, y: -0.4 },
  sm: { scale: 0.65, y: -0.4 },
  md: { scale: 0.7, y: -0.4 },
  lg: { scale: 0.8, y: -0.4 },
  xl: { scale: 0.85, y: -0.4 },
  xxl: { scale: 0.95, y: -0.2 },
};

export default function Scene({
  flavor,
}: {
  flavor: "original" | "cherry" | "zero" | "lime" | "coffee";
}) {
  const canRef = useRef<Group>(null);
  const breakpoint = useBreakpoint();
  const { scale, y } = CAN_LAYOUT_BY_BREAKPOINT[breakpoint];

  useGSAP(
    () => {
      if (!canRef.current) return;

      gsap.set(canRef.current.scale, { x: scale, y: scale, z: scale });
      gsap.set(canRef.current.position, { x: 0, y, z: 0 });

      gsap.to(canRef.current.rotation, {
        y: Math.PI * 2,
        duration: 2,
        scrollTrigger: {
          trigger: ".hero-single",
          start: "top top",
          end: "bottom 110%",
          scrub: 1.5,
        },
      });

      gsap.to(canRef.current.position, {
        x: 0,
        duration: 1.2,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: "#productIntro",
          start: "top top",
          toggleActions: "play none none reverse",
        },
      });
    },
    { dependencies: [breakpoint] }
  );

  return (
    <>
      <group rotation={[0, 0, 0]}>
        <FloatingCan
          ref={canRef}
          flavor={flavor}
          rotationIntensity={1}
          floatIntensity={1}
          floatSpeed={3}
        />
      </group>
      <directionalLight
        position={[0, 0, 5]}
        intensity={0.7}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <CanLighting />
    </>
  );
}
