"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-primary text-secondary font-poppins fixed top-0 left-0 z-50 flex h-20 w-full items-center justify-between p-4 uppercase">
      <div className="flex items-center gap-3">
        <button
          className="lg:hidden"
          onClick={() => setIsMenuOpen((v) => !v)}
          aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={isMenuOpen}
        >
          Menu
        </button>
        <ul className="hidden gap-3 text-xl font-bold lg:flex">
          <li className="underline-effect">
            <Link href="/product/original">Produits</Link>
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
        <button type="button" className="text-xl font-bold">
          Bulles
        </button>
      </div>

      {isMenuOpen && (
        <div className="bg-primary absolute top-full left-0 flex w-full flex-col gap-4 p-4 text-xl font-bold lg:hidden">
          <Link href="/product/original" onClick={() => setIsMenuOpen(false)}>
            Produits
          </Link>
        </div>
      )}
    </nav>
  );
}
