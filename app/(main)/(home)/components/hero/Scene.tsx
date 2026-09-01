"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { Group } from "three";

import { CanLighting } from "@/components/experience/cans/CanLighting";
import FloatingCan from "@/components/experience/cans/FloatingCan";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { useAnimationStore } from "@/store/useAnimationStore";
import { useBubbleStore } from "@/store/useBubbleStore";

import { HERO_CONFIG } from "./heroConfig";

gsap.registerPlugin(ScrollTrigger);

export default function Scene({ onReady }: { onReady?: () => void }) {
  const groupRef = useRef<Group>(null);
  const can1Ref = useRef<Group>(null);
  const can2Ref = useRef<Group>(null);
  const can3Ref = useRef<Group>(null);

  const breakpoint = useBreakpoint();
  const config = HERO_CONFIG[breakpoint];

  const createIntroTimeline = useAnimationStore((s) => s.createIntroTimeline);
  const introPlayed = useAnimationStore((s) => s.introPlayed);
  const setBubblesPlaying = useBubbleStore((s) => s.setPlaying);

  // `breakpoint` starts on a guessed default and corrects itself right
  // after mount (see useBreakpoint). Gating the intro tween on `ready`
  // (flipped from the same effect that reports "mesh loaded" upward) means
  // it only ever builds once that correction has already landed, instead
  // of building against the guess and then getting reverted/rebuilt when
  // useGSAP's dependency array sees the breakpoint change moments later -
  // which, for tweens living on the *shared* intro timeline (also touched
  // by Header/Hero), risked the revert tripping up whichever one calls
  // .play().
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setReady(true));
    onReady?.();
    return () => cancelAnimationFrame(raf);
  }, [onReady]);

  // Scroll-driven entrance for can2/can3 and the group rotation - entirely
  // self-contained (not on the shared intro timeline), so it can safely
  // rebuild whenever the breakpoint changes.
  useGSAP(
    () => {
      if (!can1Ref.current || !can2Ref.current || !can3Ref.current) return;

      // can1 stays invisible until the ready-gated intro effect below takes
      // over (see its comment for why that's delayed a frame past mount).
      // Without this, can1 renders at its default position/scale for that
      // one frame - a visible flash before it jumps to its real off-screen
      // starting point.
      gsap.set(can1Ref.current.scale, { x: 0, y: 0, z: 0 });

      gsap.set(can2Ref.current.position, {
        ...config.scrollCan2.from.position,
      });
      gsap.set(can2Ref.current.scale, {
        x: config.scrollCan2.from.scale,
        y: config.scrollCan2.from.scale,
        z: config.scrollCan2.from.scale,
      });
      gsap.set(can3Ref.current.position, {
        ...config.scrollCan3.from.position,
      });
      gsap.set(can3Ref.current.scale, {
        x: config.scrollCan3.from.scale,
        y: config.scrollCan3.from.scale,
        z: config.scrollCan3.from.scale,
      });

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom 10%",
          scrub: 1,
        },
      });

      if (groupRef.current) {
        scrollTl.to(
          groupRef.current.rotation,
          { y: config.scrollGroupRotationY },
          0
        );
      }

      scrollTl.to(
        can1Ref.current.position,
        { ...config.scrollCan1.position },
        0
      );
      if (config.scrollCan1.rotation) {
        scrollTl.to(
          can1Ref.current.rotation,
          { ...config.scrollCan1.rotation },
          0
        );
      }

      scrollTl.to(
        can2Ref.current.position,
        { ...config.scrollCan2.to.position },
        0
      );
      if (config.scrollCan2.to.rotation) {
        scrollTl.to(
          can2Ref.current.rotation,
          { ...config.scrollCan2.to.rotation },
          0
        );
      }
      if (config.scrollCan2.to.scale) {
        const s = config.scrollCan2.to.scale;
        scrollTl.to(can2Ref.current.scale, { x: s, y: s, z: s }, 0);
      }

      scrollTl.to(
        can3Ref.current.position,
        { ...config.scrollCan3.to.position },
        0
      );
      if (config.scrollCan3.to.rotation) {
        scrollTl.to(
          can3Ref.current.rotation,
          { ...config.scrollCan3.to.rotation },
          0
        );
      }
      if (config.scrollCan3.to.scale) {
        const s = config.scrollCan3.to.scale;
        scrollTl.to(can3Ref.current.scale, { x: s, y: s, z: s }, 0);
      }
    },
    { dependencies: [breakpoint] }
  );

  // can1's entrance on the shared intro timeline - only built once the mesh
  // is ready (see `ready` above) and the breakpoint has settled.
  useGSAP(
    () => {
      if (!ready || !can1Ref.current) return;

      if (introPlayed) {
        gsap.set(can1Ref.current.position, { ...config.finalCan1.position });
        gsap.set(can1Ref.current.scale, {
          x: config.finalCan1.scale,
          y: config.finalCan1.scale,
          z: config.finalCan1.scale,
        });
        return;
      }

      gsap.set(can1Ref.current.position, {
        ...config.introCan1.from.position,
      });
      gsap.set(can1Ref.current.scale, {
        x: config.introCan1.from.scale,
        y: config.introCan1.from.scale,
        z: config.introCan1.from.scale,
      });

      const tl = createIntroTimeline();
      tl.to(can1Ref.current.position, {
        ...config.introCan1.to.position,
        duration: 1,
        ease: "back.out(1.4)",
      });
      if (config.introCan1.to.rotation) {
        tl.to(
          can1Ref.current.rotation,
          {
            ...config.introCan1.to.rotation,
            duration: 1,
            ease: "back.out(1.4)",
          },
          "<"
        );
      }

      // Bubbles only autostart the first time the intro actually plays - a
      // return visit within the session skips straight to the resting
      // state above and leaves them off until the user hits "Bulles".
      tl.call(() => setBubblesPlaying(true));
    },
    { dependencies: [ready, breakpoint, introPlayed] }
  );

  return (
    <group ref={groupRef}>
      <FloatingCan ref={can1Ref} flavor="original" />
      <FloatingCan ref={can2Ref} flavor="zero" floatSpeed={0.9} />
      <FloatingCan ref={can3Ref} flavor="coffee" floatSpeed={1.1} />
      <CanLighting />
    </group>
  );
}
