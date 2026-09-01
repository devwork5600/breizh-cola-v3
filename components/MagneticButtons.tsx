"use client";

import gsap from "gsap";
import { useLayoutEffect, useRef, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function MagneticButtons({ children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.set(el, {
      x: 0,
      y: 0,
      force3D: true,
    });

    const xTo = gsap.quickTo(el, "x", {
      duration: 0.5,
      ease: "power3.out",
    });

    const yTo = gsap.quickTo(el, "y", {
      duration: 0.5,
      ease: "power3.out",
    });

    const move = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();

      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      xTo(x * 0.9);
      yTo(y * 0.9);
    };

    const leave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);

    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="inline-block h-fit w-fit transform-gpu will-change-transform"
    >
      {children}
    </div>
  );
}
