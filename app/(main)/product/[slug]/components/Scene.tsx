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
  { scale: number; y: number; movedX: number }
> = {
  // `movedX` is where the can slides to once the description text below
  // starts revealing (see the second tween below) - on narrower
  // breakpoints there's no room to shift it sideways without running off
  // screen, so it stays at 0; xl/xxl have the width to spare.
  xs: { scale: 0.6, y: -0.4, movedX: 0 },
  sm: { scale: 0.65, y: -0.4, movedX: 0 },
  md: { scale: 0.7, y: -0.4, movedX: 0 },
  lg: { scale: 0.8, y: -0.4, movedX: 0 },
  xl: { scale: 0.85, y: -0.4, movedX: 1.3 },
  xxl: { scale: 0.95, y: -0.2, movedX: 1.5 },
};

export default function Scene({
  flavor,
}: {
  flavor: "original" | "cherry" | "zero" | "lime" | "coffee";
}) {
  const canRef = useRef<Group>(null);
  const breakpoint = useBreakpoint();
  const { scale, y, movedX } = CAN_LAYOUT_BY_BREAKPOINT[breakpoint];

  useGSAP(
    () => {
      if (!canRef.current) return;

      // Defensive cleanup matching the reference: useGSAP's context revert
      // kills tweens/triggers created by *this* effect's own previous run,
      // but without this explicit kill, a run that never got the chance to
      // register with the context (e.g. React StrictMode's dev-only
      // mount -> cleanup -> mount double-invoke leaving a stray instance
      // behind) can leave a second ScrollTrigger+tween bound to the same
      // trigger. Two of them fighting over can.position.x is exactly what
      // made the reverse (toggleActions' "reverse") look instant instead
      // of animated - the second tween's own tracked range collapses to
      // ~0 once the first one already reached the target.
      ScrollTrigger.getAll().forEach((t) => {
        if (
          t.vars.trigger === ".hero-single" ||
          t.vars.trigger === "#productIntro"
        ) {
          t.kill();
        }
      });

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

      // Direct translate, fired with the description text reveal instead
      // of scrubbed to scroll - moves the can out of the text's way on
      // breakpoints wide enough to have somewhere to put it.
      //
      // ease is inOut rather than back.out on purpose: toggleActions'
      // "reverse" plays this same tween backward in time, and an ease-out
      // curve (slow arrival, fast start) reversed becomes an ease-in curve
      // (slow start, fast/abrupt arrival) - the can would glide out nicely
      // but snap sharply into place on the way back. inOut eases are
      // symmetric under time-reversal, so both directions feel the same.
      gsap.to(canRef.current.position, {
        x: movedX,
        duration: 1.2,
        ease: "power3.inOut",
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
