"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

import ShaderBackground from "./shader-background";

export default function BackgroundCanvas() {
  return (
    <Canvas
      style={{
        position: "fixed",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        overflow: "hidden",
        pointerEvents: "none",
        width: "100%",
        height: "100vh",
      }}
      shadows
      dpr={[1, 1.5]}
      gl={{ antialias: true }}
      camera={{
        fov: 30,
      }}
    >
      <Suspense fallback={null}>
        <ShaderBackground />
      </Suspense>
    </Canvas>
  );
}
