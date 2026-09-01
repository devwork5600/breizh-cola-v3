"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import fragmentShader from "@/shaders/fragment/fragmentBackground.glsl";
import vertexShader from "@/shaders/vertex/vertexBackground.glsl";

export default function ShaderBackground() {
  const { viewport } = useThree();
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ clock, size }) => {
    if (!materialRef.current) return;

    materialRef.current.uniforms.uTime.value = clock.elapsedTime;
    materialRef.current.uniforms.uResolution.value.set(size.width, size.height);
  });

  return (
    <mesh>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <shaderMaterial
        ref={materialRef}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={{
          uTime: { value: 0 },
          uResolution: { value: new THREE.Vector2() },
        }}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
