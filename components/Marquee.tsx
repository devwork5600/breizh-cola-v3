"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

interface MarqueeProps {
  initialDirection?: number;
  speed?: number;
  sentence?: string;
  bgColor?: string;
}

export default function Marquee({
  initialDirection = 1,
  speed = 1,
  sentence,
  bgColor = "#591420",
}: MarqueeProps) {
  const firstText = useRef<HTMLParagraphElement>(null);
  const secondText = useRef<HTMLParagraphElement>(null);
  const slider = useRef<HTMLDivElement>(null);

  const xPercent = useRef(0);
  const direction = useRef(-1);

  useGSAP(() => {
    const setSecondTextPosition = () => {
      if (secondText.current) {
        gsap.set(secondText.current, {
          left: secondText.current.getBoundingClientRect().width,
        });
      }
    };

    setSecondTextPosition();

    gsap.to(slider.current, {
      scrollTrigger: {
        trigger: document.documentElement,
        scrub: 0.5,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (e) => (direction.current = e.direction * initialDirection),
      },
    });

    const tickerUpdate = () => {
      if (!firstText.current || !secondText.current) return;

      if (xPercent.current < -100) {
        xPercent.current = 0;
      } else if (xPercent.current > 0) {
        xPercent.current = -100;
      }

      gsap.set([firstText.current, secondText.current], {
        xPercent: xPercent.current,
      });
      xPercent.current += 0.05 * speed * direction.current;
    };

    gsap.ticker.add(tickerUpdate);

    const handleResize = () => setSecondTextPosition();
    window.addEventListener("resize", handleResize);

    return () => {
      gsap.ticker.remove(tickerUpdate);
      window.removeEventListener("resize", handleResize);
    };
  }, [speed, initialDirection]);

  return (
    <div
      style={{ backgroundColor: bgColor }}
      className="text-secondary border-secondary relative z-5 border-y-2"
    >
      <div className="relative flex h-[8vh] w-full overflow-hidden sm:h-[10vh] lg:h-25 2xl:h-32.5">
        <div className="absolute top-1/2 z-10 -translate-x-3 -translate-y-1/2">
          <div
            ref={slider}
            className="font-poppins relative text-3xl whitespace-nowrap capitalize sm:text-5xl lg:text-6xl 2xl:text-7xl"
          >
            <p className="relative m-0 pr-5" ref={firstText}>
              {sentence}
            </p>
            <p className="absolute top-0 left-full m-0 pr-5" ref={secondText}>
              {sentence}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
