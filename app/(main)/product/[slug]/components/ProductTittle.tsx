"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function ProductTitle({ name = "original" }: { name?: string }) {
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const ref5 = useRef(null);

  const titleContainerRef = useRef(null);

  useGSAP(() => {
    if (!titleContainerRef.current) return;

    const refs = [ref1, ref2, ref3, ref4, ref5];
    const translateYValues = ["100%", "200%", "300%", "400%", "500%"];

    refs.forEach((ref, index) => {
      gsap.to(ref.current, {
        translateY: translateYValues[index],
        duration: 0.5,
        ease: "back.out(2)",
        scrollTrigger: {
          trigger: titleContainerRef.current,
          start: "top 12%",
          end: "bottom 99%",
          toggleActions: "play none none reverse",
        },
      });
    });
  }, []);

  return (
    <div
      ref={titleContainerRef}
      className="absolute top-12 left-0 z-5 h-[40vh] w-full"
      id="singleTtitle"
    >
      <div className="relative text-5xl tracking-wider sm:text-7xl lg:text-8xl">
        <div className="text-secondary text-stroke-secondary-1 font-poppins absolute top-0 right-0 left-0 z-10 mx-auto w-fit uppercase opacity-100">
          {name}
        </div>
        <div
          ref={ref1}
          className="text-stroke-secondary-1 text-primary font-poppins absolute top-0 right-0 left-0 mx-auto w-fit uppercase opacity-70"
        >
          {name}
        </div>
        <div
          ref={ref2}
          className="text-stroke-secondary-1 text-primary font-poppins absolute top-0 right-0 left-0 mx-auto w-fit uppercase opacity-50"
        >
          {name}
        </div>
        <div
          ref={ref3}
          className="text-stroke-secondary-1 text-primary font-poppins absolute top-0 right-0 left-0 mx-auto w-fit uppercase opacity-30"
        >
          {name}
        </div>
        <div
          ref={ref4}
          className="text-stroke-secondary-1 text-primary font-poppins absolute top-0 right-0 left-0 mx-auto w-fit uppercase opacity-10"
        >
          {name}
        </div>
        <div
          ref={ref5}
          className="text-stroke-secondary-1 text-primary font-poppins absolute top-0 right-0 left-0 mx-auto w-fit uppercase opacity-5"
        >
          {name}
        </div>
      </div>
    </div>
  );
}
