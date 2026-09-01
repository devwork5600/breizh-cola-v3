"use client";

import { Billboard, View } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { ArrowBigLeftDashIcon, ArrowBigRightDashIcon } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import { Group } from "three";

import { CanLighting } from "@/components/experience/cans/CanLighting";
import FloatingCan from "@/components/experience/cans/FloatingCan";
import { SodaCanProps } from "@/components/experience/cans/SodaCan";
import { Breakpoint, useBreakpoint } from "@/lib/useBreakpoint";

gsap.registerPlugin(Observer);

// The View's height shrinks a lot between breakpoints (h-52 to h-124), so a
// fixed orbit radius either crams the cans together on mobile or leaves them
// cramped/oversized on desktop. Keyed per breakpoint like the reference.
const CAROUSEL_CONFIG_BY_BREAKPOINT: Record<
  Breakpoint,
  {
    radiusX: number;
    radiusZ: number;
    scaleRange: [number, number];
    duration: number;
  }
> = {
  xs: { radiusX: 1.7, radiusZ: 0.65, scaleRange: [0.6, 1.2], duration: 0.9 },
  sm: { radiusX: 2.4, radiusZ: 0.85, scaleRange: [1, 1.2], duration: 1 },
  md: { radiusX: 2.45, radiusZ: 0.9, scaleRange: [0.95, 1.25], duration: 1 },
  lg: { radiusX: 2.3, radiusZ: 0.95, scaleRange: [0.9, 1.2], duration: 1 },
  xl: { radiusX: 2.2, radiusZ: 0.95, scaleRange: [1, 1.15], duration: 1 },
  xxl: { radiusX: 2.4, radiusZ: 0.95, scaleRange: [1, 1.2], duration: 1 },
};

const FLAVORS: { flavor: SodaCanProps["flavor"] }[] = [
  { flavor: "original" },
  { flavor: "zero" },
  { flavor: "cherry" },
  { flavor: "lime" },
  { flavor: "coffee" },
];

function CarouselScene({
  angleRef,
  config,
}: {
  angleRef: RefObject<number>;
  config: (typeof CAROUSEL_CONFIG_BY_BREAKPOINT)[Breakpoint];
}) {
  const canRefs = useRef<(Group | null)[]>([]);

  const total = FLAVORS.length;
  const anglePerCan = useMemo(() => (2 * Math.PI) / total, [total]);
  const { radiusX, radiusZ, scaleRange } = config;

  useFrame(() => {
    canRefs.current.forEach((can, index) => {
      if (!can) return;

      const angle = index * anglePerCan + angleRef.current;

      can.position.x = Math.sin(angle) * radiusX;
      can.position.z = Math.cos(angle) * radiusZ;

      const scale = gsap.utils.mapRange(
        -radiusZ,
        radiusZ,
        scaleRange[0],
        scaleRange[1],
        can.position.z
      );
      can.scale.setScalar(scale);
    });
  });

  return (
    <>
      {FLAVORS.map((flavor, index) => (
        <Billboard key={index} lockX lockZ>
          <FloatingCan
            ref={(el) => {
              canRefs.current[index] = el;
            }}
            flavor={flavor.flavor}
            floatIntensity={0.7}
            rotationIntensity={0.8}
          />
        </Billboard>
      ))}
      <CanLighting />
    </>
  );
}

export default function Carousel() {
  const [isAnimating, setIsAnimating] = useState(false);
  const isAnimatingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const angleRef = useRef(0);

  const breakpoint = useBreakpoint();
  const config = CAROUSEL_CONFIG_BY_BREAKPOINT[breakpoint];

  const anglePerCan = useMemo(() => (2 * Math.PI) / FLAVORS.length, []);

  const rotateBy = useCallback(
    (direction: number) => {
      if (isAnimatingRef.current) return;

      isAnimatingRef.current = true;
      setIsAnimating(true);

      gsap.to(angleRef, {
        current: angleRef.current + direction * anglePerCan,
        duration: config.duration,
        ease: "power2.inOut",
        onComplete: () => {
          isAnimatingRef.current = false;
          setIsAnimating(false);
        },
      });
    },
    [anglePerCan, config.duration]
  );

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = Observer.create({
      target: containerRef.current,
      type: "touch,pointer",
      onLeft: () => rotateBy(-1),
      onRight: () => rotateBy(1),
    });

    return () => observer.kill();
  }, [rotateBy]);

  return (
    <div
      ref={containerRef}
      className="carousel relative z-40 my-36 flex w-full items-center justify-center"
    >
      <button
        onClick={() => rotateBy(-1)}
        disabled={isAnimating}
        className="absolute top-1/2 left-0 z-100 hidden h-12 w-12 -translate-y-1/2 disabled:pointer-events-none disabled:opacity-30 lg:left-8 lg:block 2xl:left-24"
      >
        <ArrowBigLeftDashIcon
          className="text-secondary size-8 lg:size-14 xl:size-11 2xl:size-13"
          strokeWidth={1.5}
        />
      </button>

      <button
        onClick={() => rotateBy(1)}
        disabled={isAnimating}
        className="absolute top-1/2 right-2 z-100 hidden h-12 w-12 -translate-y-1/2 disabled:pointer-events-none disabled:opacity-30 lg:right-8 lg:block 2xl:right-24"
      >
        <ArrowBigRightDashIcon
          className="text-secondary lg:size-14 xl:size-11 2xl:size-13"
          strokeWidth={1.5}
        />
      </button>

      <div className="relative z-50 flex w-full items-center justify-center">
        <View className="h-52 w-full sm:h-72 md:h-82 lg:h-96 xl:h-112 2xl:h-124">
          <CarouselScene angleRef={angleRef} config={config} />
        </View>
      </div>
    </div>
  );
}
