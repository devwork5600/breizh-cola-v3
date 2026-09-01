"use client";

import { View } from "@react-three/drei";

import Scene from "./Scene";

const heroLines = [
  ["breizh", "cola"],
  ["le", "cola", "du"],
  ["phare", "ouest"],
];

export default function Hero() {
  return (
    <div className="w-full">
      <View className="pointer-events-none sticky top-0 z-10 mt-[-100vh] h-screen w-full">
        <Scene />
      </View>

      <div className="hero relative tracking-wider">
        <div className="font-poppins text-secondary relative z-20 flex h-dvh w-full flex-col items-center p-4 pt-40 uppercase xl:items-start xl:justify-center 2xl:pl-24">
          {heroLines.map((line, i) => (
            <div
              key={i}
              className="flex text-5xl tracking-wider sm:text-6xl md:text-7xl xl:text-8xl 2xl:text-[140px]"
            >
              {line.map((word, j) => (
                <span
                  key={j}
                  className={`pr-4 ${j === 1 ? "text-stroke-secondary text-primary" : ""}`}
                >
                  {word}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
