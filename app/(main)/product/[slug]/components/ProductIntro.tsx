"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMemo, useRef } from "react";

import { productsDetails } from "@/lib/data";
import { splitWords } from "@/lib/splitters";

gsap.registerPlugin(ScrollTrigger);

export default function ProductIntro({
  variant,
}: {
  variant: "original" | "cherry" | "zero" | "lime" | "coffee";
}) {
  const pinSectionRef = useRef<HTMLDivElement | null>(null);
  const letterRefs = useRef<HTMLSpanElement[]>([]);

  const product = useMemo(
    () => productsDetails.find((p) => p.name === variant),
    [variant]
  );

  const infosText = product?.description ?? [];

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
      },
    });
  }, [variant]);

  return (
    <section
      ref={pinSectionRef}
      id="productIntro"
      className="font-poppins text-primary relative z-50 flex h-screen w-full justify-start p-8 text-xl sm:text-3xl lg:pt-36 xl:items-center xl:text-4xl 2xl:text-5xl"
    >
      <div className="text-secondary max-w-4xl leading-snug">
        {infosText.map((phrase, index) => (
          <div key={index} className="my-6 flex flex-wrap gap-2 leading-tight">
            {splitWords(phrase, letterRefs)}
          </div>
        ))}
      </div>
    </section>
  );
}
