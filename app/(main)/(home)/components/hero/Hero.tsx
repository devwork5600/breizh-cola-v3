"use client";

import { useGSAP } from "@gsap/react";
import { View } from "@react-three/drei";
import gsap from "gsap";
import { useCallback, useRef, useState } from "react";

import { useAnimationStore } from "@/store/useAnimationStore";

import PinnedReveal from "./pin-reveal";
import Scene from "./Scene";

const HERO_DESCRIPTION =
  "Breizh Cola incarne un esprit libre et breton, une boisson de caractère née à l'Ouest, pour ceux qui recherchent authenticité, fraîcheur et goût.";

const heroLines = [
  ["breizh", "cola"],
  ["le", "cola", "du"],
  ["phare", "ouest"],
];

export default function Hero() {
  const [meshReady, setMeshReady] = useState(false);
  const onReady = useCallback(() => setMeshReady(true), []);

  const titleRefs = useRef<HTMLSpanElement[]>([]);
  const createIntroTimeline = useAnimationStore((s) => s.createIntroTimeline);
  const introPlayed = useAnimationStore((s) => s.introPlayed);

  const addTitleRef = (el: HTMLSpanElement | null) => {
    if (el && !titleRefs.current.includes(el)) titleRefs.current.push(el);
  };

  useGSAP(
    () => {
      if (!meshReady) return;

      if (introPlayed) {
        gsap.set(titleRefs.current, { y: "0%" });
        return;
      }

      gsap.set(titleRefs.current, { y: "100%" });

      const tl = createIntroTimeline();
      tl.to(
        titleRefs.current,
        { y: "0%", stagger: 0.15, duration: 0.8, ease: "power4.out" },
        "intro"
      );
      tl.play();
    },
    { dependencies: [meshReady, introPlayed] }
  );

  return (
    <div className="w-full">
      <View className="pointer-events-none sticky top-0 z-10 mt-[-100vh] h-screen w-full">
        <Scene onReady={onReady} />
      </View>

      <div className="hero relative tracking-wider">
        <div className="font-poppins text-secondary relative z-20 flex h-dvh w-full flex-col items-center p-4 pt-40 uppercase xl:items-start xl:justify-center 2xl:pl-24">
          {heroLines.map((line, i) => (
            <div
              key={i}
              className="flex overflow-hidden text-5xl tracking-wider sm:text-6xl md:text-7xl xl:text-8xl 2xl:text-[140px]"
            >
              {line.map((word, j) => (
                <span
                  key={j}
                  ref={addTitleRef}
                  className={`translate-y-full pr-4 ${j === 1 ? "text-stroke-secondary text-primary" : ""}`}
                >
                  {word}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <PinnedReveal className="text-xl" text={HERO_DESCRIPTION} />
    </div>
  );
}
