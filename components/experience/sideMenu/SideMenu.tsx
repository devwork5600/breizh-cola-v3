"use client";

import gsap from "gsap";
import { XIcon } from "lucide-react";
import { useEffect, useLayoutEffect, useRef } from "react";

import { useMenuStore, useSidebarCanStore } from "@/store/useMenuStore";

import SidebarCanvas from "./SideMenuCanvas";
import MenuLink from "./SideMenuLink";

const items = [
  { href: "/product/original", label: "original" },
  { href: "/product/zero", label: "zero" },
  { href: "/product/cherry", label: "cherry" },
  { href: "/product/lime", label: "lime" },
  { href: "/product/coffee", label: "café" },
];

export default function SideMenu() {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<GSAPTimeline | null>(null);

  const imageAreaRef = useRef<HTMLDivElement>(null);

  const isMenuOpen = useMenuStore((state) => state.isMenuOpen);
  const closeMenu = useMenuStore((state) => state.closeMenu);
  const setAnimating = useMenuStore((state) => state.setAnimating);

  const setActiveCan = useSidebarCanStore((s) => s.setActiveCan);
  const resetActiveCan = useSidebarCanStore((state) => state.resetActiveCan);

  useLayoutEffect(() => {
    if (!sidebarRef.current) return;

    const ctx = gsap.context(() => {
      const links = gsap.utils.toArray(".menu-link");

      gsap.set(links, { y: "100%" });
      gsap.set(imageAreaRef.current, { y: "100%", opacity: 0 });

      const tl = gsap.timeline({
        paused: true,

        onStart: () => setAnimating(true),

        onComplete: () => setAnimating(false),

        onReverseComplete: () => {
          setAnimating(false);

          gsap.set(links, { y: "100%" });
          gsap.set(imageAreaRef.current, { y: "100%", opacity: 0 });

          resetActiveCan();
        },
      });

      tl.fromTo(
        sidebarRef.current,
        { x: "-100%" },
        {
          x: "0%",
          duration: 0.9,
          ease: "power3.inOut",
        }
      );

      tl.to(
        imageAreaRef.current,
        {
          y: "0%",
          opacity: 1,
          duration: 1,
          ease: "power4.out",
        },
        "-=0.6"
      );

      tl.to(
        links,
        {
          y: "0%",
          duration: 1,
          ease: "power4.out",
          stagger: 0.15,
        },
        "-=0.8"
      );

      timelineRef.current = tl;
    }, sidebarRef);

    return () => ctx.revert();
  }, [resetActiveCan, setAnimating]);

  useEffect(() => {
    const tl = timelineRef.current;
    if (!tl) return;

    if (isMenuOpen) tl.play();
    else tl.reverse();
  }, [isMenuOpen]);

  return (
    <div
      ref={sidebarRef}
      className="bg-secondary text-primary fixed inset-0 z-999 flex -translate-x-full flex-col"
    >
      <div className="relative flex h-20 items-center justify-center pt-5">
        <button onClick={closeMenu} className="absolute top-6 left-2 text-2xl">
          <XIcon size={28} />
        </button>

        <MenuLink
          href="/"
          className="font-cream-cake absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center text-4xl capitalize sm:text-5xl md:text-6xl"
        >
          Breizh Cola
        </MenuLink>
      </div>

      <div className="flex flex-1 flex-col justify-center p-12 lg:flex-row">
        <div
          ref={imageAreaRef}
          className="relative m-22 hidden flex-1 items-center justify-center overflow-hidden lg:flex"
        >
          <div
            className="pointer-events-none absolute top-0 right-0 left-0 z-10 h-16"
            style={{
              background:
                "linear-gradient(to bottom, rgba(245,221,210,0.6) 0%, transparent 100%)",
            }}
          />
          <SidebarCanvas />
          <div
            className="pointer-events-none absolute right-0 bottom-0 left-0 z-10 h-16"
            style={{
              background:
                "linear-gradient(to top, rgba(245,221,210,0.6) 0%, transparent 100%)",
            }}
          />
        </div>

        <nav className="flex flex-1 flex-col items-center justify-center gap-6 lg:items-start">
          {items.map((item, index) => (
            <div key={item.href} className="overflow-hidden">
              <MenuLink
                href={item.href}
                onMouseEnter={() => setActiveCan(index)}
                className="menu-link font-cream-cake group block translate-y-full text-5xl sm:text-6xl lg:text-7xl 2xl:text-[80px]"
              >
                Breizh{" "}
                <span className="text-primary font-poppins text-4xl transition-colors duration-300 lg:text-5xl 2xl:text-6xl">
                  {item.label}
                </span>
              </MenuLink>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
