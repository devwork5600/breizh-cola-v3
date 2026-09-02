"use client";

import gsap from "gsap";
import { useLayoutEffect } from "react";

import {
  useResponsiveStore,
  type Breakpoint,
} from "@/store/useResponsiveStore";

// Same thresholds as lib/useBreakpoint.ts (Tailwind's defaults), expressed
// as media queries instead of an innerWidth comparison.
const BREAKPOINTS = {
  xs: "(max-width: 639px)",
  sm: "(min-width: 640px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
  xl: "(min-width: 1280px)",
  xxl: "(min-width: 1536px)",
};

export function ResponsiveProvider() {
  const setBreakpoint = useResponsiveStore((s) => s.setBreakpoint);
  const setReady = useResponsiveStore((s) => s.setReady);
  const incrementResizeCount = useResponsiveStore(
    (s) => s.incrementResizeCount
  );

  useLayoutEffect(() => {
    const width = window.innerWidth;
    let initialBreakpoint: Breakpoint = "xs";
    if (width >= 1536) initialBreakpoint = "xxl";
    else if (width >= 1280) initialBreakpoint = "xl";
    else if (width >= 1024) initialBreakpoint = "lg";
    else if (width >= 768) initialBreakpoint = "md";
    else if (width >= 640) initialBreakpoint = "sm";

    setBreakpoint(initialBreakpoint);
    setReady(true);

    // gsap.matchMedia() ties into GSAP's own responsive-animation handling:
    // anything created inside this callback (ScrollTriggers, timelines) is
    // scoped to it and gets cleanly reverted the moment the media query
    // actually flips - driven by the browser's native matchMedia change
    // event, so it's already in lockstep with whichever CSS breakpoint
    // Tailwind just applied, instead of a manually-diffed innerWidth
    // reading racing against layout.
    const mm = gsap.matchMedia();
    mm.add(BREAKPOINTS, (context) => {
      const { sm, md, lg, xl, xxl } = context.conditions as Record<
        keyof typeof BREAKPOINTS,
        boolean
      >;
      const current: Breakpoint = xxl
        ? "xxl"
        : xl
          ? "xl"
          : lg
            ? "lg"
            : md
              ? "md"
              : sm
                ? "sm"
                : "xs";
      setBreakpoint(current);
    });

    // Raw resize tick for consumers that need to re-sync scroll-linked
    // geometry (e.g. ScrollTrigger boundaries) even within one breakpoint,
    // not just when the bucket itself changes.
    const handleResize = () => incrementResizeCount();
    window.addEventListener("resize", handleResize);

    return () => {
      mm.revert();
      window.removeEventListener("resize", handleResize);
    };
  }, [setBreakpoint, setReady, incrementResizeCount]);

  return null;
}
