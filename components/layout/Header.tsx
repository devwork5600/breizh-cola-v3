"use client";

import { MenuIcon } from "lucide-react";
import Link from "next/link";

import { useBubbleStore } from "@/store/useBubbleStore";
import { useMenuStore } from "@/store/useMenuStore";

export default function Header() {
  const togglePlay = useBubbleStore((state) => state.togglePlay);
  const openMenu = useMenuStore((state) => state.openMenu);

  return (
    <nav className="bg-primary text-secondary font-poppins fixed top-0 left-0 z-50 flex h-20 w-full items-center justify-between p-4 uppercase">
      <div className="flex items-center gap-3">
        <button
          className="lg:hidden"
          onClick={openMenu}
          aria-label="Ouvrir le menu"
        >
          <MenuIcon size={28} />
        </button>
        <ul className="hidden gap-3 text-xl font-bold lg:flex">
          <li className="underline-effect">
            <button onClick={openMenu}>Produits</button>
          </li>
        </ul>
      </div>

      <Link
        href="/"
        className="font-cream-cake absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl normal-case sm:text-5xl md:text-6xl"
      >
        Breizh Cola
      </Link>

      <div className="flex items-center">
        <button
          type="button"
          onClick={togglePlay}
          className="text-xl font-bold"
        >
          Bulles
        </button>
      </div>
    </nav>
  );
}
