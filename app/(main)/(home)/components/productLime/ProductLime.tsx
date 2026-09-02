"use client";

import { View } from "@react-three/drei";
import Link from "next/link";

import MagneticButtons from "@/components/MagneticButtons";

import Scene from "./Scene";

export default function ProductLime() {
  return (
    <div className="product-lime relative flex min-h-screen w-full justify-center overflow-hidden px-2 pt-16 lg:px-8 xl:items-center xl:justify-end xl:pt-0">
      <View className="pointer-events-none absolute top-0 left-0 z-30 h-full w-full">
        <Scene />
      </View>
      <div className="absolute top-[84vh] right-[35%] sm:top-[57vh] sm:right-[55vw]">
        <MagneticButtons>
          <Link href="/product/lime">
            <button className="text-secondary hover:bg-secondary hover:text-primary bg-primary relative h-22 w-44 rotate-8 cursor-pointer rounded-[50%] border-2 font-bold uppercase sm:h-28 sm:w-56 sm:text-xl md:right-0 md:h-31.25 md:w-62.5 md:text-2xl xl:h-37.5 xl:w-75 xl:text-4xl 2xl:h-45 2xl:w-90 2xl:-rotate-11">
              decouvrez-le
            </button>
          </Link>
        </MagneticButtons>
      </div>

      <div className="font-poppins flex flex-col gap-3 text-[34px] tracking-wider uppercase sm:gap-8 sm:text-5xl lg:gap-10 lg:text-6xl xl:items-end xl:gap-12 xl:text-7xl 2xl:gap-18 2xl:text-[86px]">
        <div className="flex flex-col sm:gap-3 xl:items-end">
          <p className="flex gap-2">
            <span className="text-secondary">note</span>
            <span className="text-stroke-secondary-1 text-primary xl:tracking-wider">
              acidulee
            </span>
          </p>
          <p className="flex gap-2">
            <span className="text-stroke-secondary-1 text-primary xl:tracking-wider">
              de citrons
            </span>
            <span className="text-secondary">verts</span>
          </p>
        </div>
        <div className="flex flex-col sm:gap-3 xl:items-end">
          <p className="flex gap-2">
            <span className="text-secondary">encore</span>
            <span className="text-stroke-secondary-1 text-primary xl:tracking-wider">
              plus
            </span>
          </p>
          <p className="flex">
            <span className="text-secondary">rafraichissant</span>
          </p>
        </div>
      </div>
    </div>
  );
}
