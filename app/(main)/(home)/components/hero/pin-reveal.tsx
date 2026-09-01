"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

import { splitWords } from "@/lib/splitters";

gsap.registerPlugin(ScrollTrigger);

interface PinnedRevealProps {
  text: string;
  className?: string;
}

export default function PinnedReveal({ text, className }: PinnedRevealProps) {
  const pinSectionRef = useRef<HTMLDivElement | null>(null);
  const letterRefs = useRef<HTMLSpanElement[]>([]);

  useGSAP(() => {
    gsap.set(letterRefs.current, { opacity: 0, y: 50 });

    gsap.to(letterRefs.current, {
      opacity: 1,
      y: 0,
      stagger: 0.05,
      ease: "power2.out",
      scrollTrigger: {
        trigger: pinSectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        pin: true,
        invalidateOnRefresh: true,
      },
    });
  }, []);

  useEffect(() => {
    function handleResize() {
      ScrollTrigger.refresh();
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section
      ref={pinSectionRef}
      className={`font-poppins relative z-5 flex h-screen w-full justify-start p-8 pt-36 text-2xl capitalize sm:text-4xl xl:items-center xl:text-5xl 2xl:text-5xl ${className ?? ""}`}
    >
      <div className="text-secondary max-w-2xl leading-snug lg:max-w-4xl xl:max-w-3xl 2xl:max-w-4xl">
        {splitWords(text, letterRefs)}
      </div>
    </section>
  );
}
