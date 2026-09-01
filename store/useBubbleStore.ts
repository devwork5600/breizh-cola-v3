import { create } from "zustand";

interface BubbleState {
  isPlaying: boolean;
  togglePlay: () => void;
  setPlaying: (value: boolean) => void;
}

export const useBubbleStore = create<BubbleState>((set) => ({
  isPlaying: false,

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

  setPlaying: (value) => set({ isPlaying: value }),
}));
