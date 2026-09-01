"use client";

import { useEffect, useState } from "react";

export type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

// Tailwind's default min-widths, checked widest-first.
const THRESHOLDS: [number, Breakpoint][] = [
  [1536, "xxl"],
  [1280, "xl"],
  [1024, "lg"],
  [768, "md"],
  [640, "sm"],
];

function getBreakpoint(width: number): Breakpoint {
  return THRESHOLDS.find(([min]) => width >= min)?.[1] ?? "xs";
}

// Defaults to "lg" so the server render and the first client render match
// (no window to measure yet); a resize listener corrects it right after
// mount, same mounted-gate pattern used elsewhere in this app.
export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("lg");

  useEffect(() => {
    const handleResize = () => setBreakpoint(getBreakpoint(window.innerWidth));
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return breakpoint;
}
