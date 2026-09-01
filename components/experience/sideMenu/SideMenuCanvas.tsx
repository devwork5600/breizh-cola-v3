"use client";

import { Canvas } from "@react-three/fiber";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";

const SidebarScene = lazy(() => import("./SideMenuScene"));

function SideMenuLoader() {
  return (
    <div className="bg-secondary/90 absolute inset-0 flex items-center justify-center">
      <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
    </div>
  );
}

export default function SideMenuCanvas() {
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const canvasConfig = useMemo(
    () => ({
      camera: { position: [0, 0, 6] as [number, number, number], fov: 25 },
      gl: { alpha: true, antialias: true },
      style: {
        position: "absolute" as const,
        inset: 0,
        pointerEvents: "none" as const,
      },
      dpr: [1, 1.5] as [number, number],
    }),
    []
  );

  if (!hasLoaded) {
    return <SideMenuLoader />;
  }

  return (
    <Canvas {...canvasConfig}>
      <Suspense fallback={null}>
        <SidebarScene />
      </Suspense>
    </Canvas>
  );
}
