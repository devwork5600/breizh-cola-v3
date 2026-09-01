"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LenisRef, ReactLenis } from "lenis/react";
import { ReactNode, useEffect, useRef } from "react";

import { useMenuStore } from "@/store/useMenuStore";

gsap.registerPlugin(ScrollTrigger);

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);
  const isMenuOpen = useMenuStore((state) => state.isMenuOpen);

  // Drive Lenis from GSAP's own ticker (autoRaf disabled below) so Lenis and
  // every ScrollTrigger-based animation share one rAF loop instead of two
  // independently-timed ones drifting apart from each other.
  useEffect(() => {
    const update = (time: number) => lenisRef.current?.lenis?.raf(time * 1000);

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    const lenis = lenisRef.current?.lenis;
    lenis?.on("scroll", ScrollTrigger.update);

    return () => {
      gsap.ticker.remove(update);
      lenis?.off("scroll", ScrollTrigger.update);
    };
  }, []);

  useEffect(() => {
    const lenis = lenisRef.current?.lenis;
    if (!lenis) return;

    if (isMenuOpen) lenis.stop();
    else lenis.start();
  }, [isMenuOpen]);

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{ lerp: 0.2, duration: 0.9, autoRaf: false }}
    >
      {children}
    </ReactLenis>
  );
}
