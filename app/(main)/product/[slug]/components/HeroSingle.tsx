"use client";

import { View } from "@react-three/drei";

import ProductIntro from "./ProductIntro";
import ProductTitle from "./ProductTittle";
import Scene from "./Scene";

export default function HeroSingle({
  variant,
}: {
  variant: "original" | "cherry" | "zero" | "lime" | "coffee";
}) {
  return (
    <div className="hero-single relative">
      <View className="hero-single-scene pointer-events-none sticky top-0 z-30 h-screen w-full">
        <Scene flavor={variant} />
      </View>
      <ProductTitle name={variant} />
      <ProductIntro variant={variant} />
    </div>
  );
}
