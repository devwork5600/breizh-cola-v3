"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

import { useAnimationStore } from "@/store/useAnimationStore";
import { useBubbleStore } from "@/store/useBubbleStore";
import { useMenuStore } from "@/store/useMenuStore";

export default function Header() {
  const togglePlay = useBubbleStore((state) => state.togglePlay);
  const openMenu = useMenuStore((state) => state.openMenu);

  const navbarRef = useRef<HTMLElement>(null);
  const createIntroTimeline = useAnimationStore((s) => s.createIntroTimeline);
  const introPlayed = useAnimationStore((s) => s.introPlayed);

  // The navbar only ever plays its part of the shared intro timeline; Hero
  // is the one that calls play() once the can mesh is actually ready, so
  // nothing reveals itself before there's something worth looking at.
  useGSAP(
    () => {
      if (!navbarRef.current) return;

      if (introPlayed) {
        gsap.set(navbarRef.current, { y: 0, opacity: 1 });
        return;
      }

      gsap.set(navbarRef.current, { y: -100, opacity: 0 });

      const tl = createIntroTimeline();
      tl.fromTo(
        navbarRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power3.out", delay: 1.4 },
        "intro"
      );
    },
    { dependencies: [introPlayed] }
  );

  return (
    <nav
      ref={navbarRef}
      className="bg-primary text-secondary font-poppins fixed top-0 left-0 z-50 flex h-20 w-full items-center justify-between p-4 uppercase"
    >
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
