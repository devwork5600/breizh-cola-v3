import gsap from "gsap";
import { create } from "zustand";

interface AnimationState {
  introPlayed: boolean;
  masterTimeline: gsap.core.Timeline | null;
  createIntroTimeline: () => gsap.core.Timeline;
}

export const useAnimationStore = create<AnimationState>((set, get) => ({
  introPlayed:
    typeof window !== "undefined"
      ? sessionStorage.getItem("introPlayed") === "true"
      : false,

  masterTimeline: null,

  createIntroTimeline: () => {
    const existingTl = get().masterTimeline;
    if (existingTl) return existingTl;

    const tl = gsap.timeline({
      paused: true,
      delay: 0.2,
      onComplete: () => {
        set({ introPlayed: true });
        sessionStorage.setItem("introPlayed", "true");
      },
    });

    set({ masterTimeline: tl });

    return tl;
  },
}));
