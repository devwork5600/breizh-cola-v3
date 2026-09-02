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
    const resizeLenis = () => lenisRef.current?.lenis?.resize();

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    const lenis = lenisRef.current?.lenis;
    lenis?.on("scroll", ScrollTrigger.update);

    // Lenis caches the page's scroll limit and only recomputes it via its
    // own ResizeObserver on document.documentElement - which doesn't fire
    // reliably in sync with a breakpoint-driven layout change here (a
    // Scene's useGSAP effect calling ScrollTrigger.refresh() can run before
    // Lenis's observer catches up). Rehooking refresh to resize keeps
    // Lenis's limit in lockstep with whatever just made GSAP recompute
    // trigger boundaries, so scrub progress keeps matching real scroll
    // position after a resize instead of drifting.
    ScrollTrigger.addEventListener("refresh", resizeLenis);

    return () => {
      gsap.ticker.remove(update);
      lenis?.off("scroll", ScrollTrigger.update);
      ScrollTrigger.removeEventListener("refresh", resizeLenis);
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
