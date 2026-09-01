import { create } from "zustand";

interface MenuState {
  isMenuOpen: boolean;
  isAnimating: boolean;

  openMenu: () => void;
  closeMenu: () => void;
  setAnimating: (value: boolean) => void;
}

export const useMenuStore = create<MenuState>((set) => ({
  isMenuOpen: false,
  isAnimating: false,

  openMenu: () =>
    set({
      isMenuOpen: true,
    }),

  closeMenu: () =>
    set({
      isMenuOpen: false,
    }),

  setAnimating: (value) =>
    set({
      isAnimating: value,
    }),
}));

interface SidebarCanState {
  activeCan: number;
  setActiveCan: (index: number) => void;
  resetActiveCan: () => void;
}

export const useSidebarCanStore = create<SidebarCanState>((set) => ({
  activeCan: 0,

  setActiveCan: (index) => set({ activeCan: index }),

  resetActiveCan: () => set({ activeCan: 0 }),
}));
