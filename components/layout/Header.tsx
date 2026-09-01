"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 z-50 flex h-20 w-full items-center justify-between p-4">
      <div className="flex items-center gap-3">
        <button
          className="lg:hidden"
          onClick={() => setIsMenuOpen((v) => !v)}
          aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={isMenuOpen}
        >
          Menu
        </button>
        <ul className="hidden gap-3 uppercase lg:flex">
          <li>
            <Link href="/product/original">Produits</Link>
          </li>
        </ul>
      </div>

      <Link
        href="/"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        Breizh Cola
      </Link>

      <div className="flex items-center">
        <button type="button" className="uppercase">
          Bulles
        </button>
      </div>

      {isMenuOpen && (
        <div className="absolute top-full left-0 flex w-full flex-col gap-4 p-4 lg:hidden">
          <Link href="/product/original" onClick={() => setIsMenuOpen(false)}>
            Produits
          </Link>
        </div>
      )}
    </nav>
  );
}
