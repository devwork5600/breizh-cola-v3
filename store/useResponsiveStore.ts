import { create } from "zustand";

export type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

interface ResponsiveState {
  isReady: boolean;
  breakpoint: Breakpoint;
  resizeCount: number;
  setBreakpoint: (val: Breakpoint) => void;
  setReady: (val: boolean) => void;
  incrementResizeCount: () => void;
}

// Mirrors the reference project's store: breakpoint comes from
// ResponsiveProvider's gsap.matchMedia() (in lockstep with the same media
// queries Tailwind itself uses), and resizeCount ticks on every raw resize
// so scroll-linked GSAP effects elsewhere can force a full rebuild even
// within a single breakpoint, not just at bucket crossings.
export const useResponsiveStore = create<ResponsiveState>((set) => ({
  isReady: false,
  breakpoint: "lg",
  resizeCount: 0,
  setBreakpoint: (val) => set({ breakpoint: val }),
  setReady: (val) => set({ isReady: val }),
  incrementResizeCount: () =>
    set((state) => ({ resizeCount: state.resizeCount + 1 })),
}));
