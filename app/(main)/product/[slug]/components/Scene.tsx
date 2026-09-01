"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { Group } from "three";

import { CanLighting } from "@/components/experience/cans/CanLighting";
import FloatingCan from "@/components/experience/cans/FloatingCan";

gsap.registerPlugin(ScrollTrigger);

export default function Scene({
  flavor,
}: {
  flavor: "original" | "cherry" | "zero" | "lime" | "coffee";
}) {
  const canRef = useRef<Group>(null);

  useGSAP(() => {
    if (!canRef.current) return;

    gsap.set(canRef.current.scale, { x: 0.8, y: 0.8, z: 0.8 });
    gsap.set(canRef.current.position, { x: 0, y: -0.4, z: 0 });

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
  }, []);

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
