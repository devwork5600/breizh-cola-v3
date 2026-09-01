"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import fragmentShader from "@/shaders/fragment/fragmentBubbles.glsl";
import vertexShader from "@/shaders/vertex/vertexBubbles.glsl";
import { useBubbleStore } from "@/store/useBubbleStore";

// Deterministic random (React-safe)
function seededRandom(seed: number) {
  return function () {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

export const BubblesGPU = ({
  count = 600,
  size = 0.05,
  opacity = 0,
  color = "#cf596d",
  speed = 1.6,
}) => {
  const pointsRef =
    useRef<THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial>>(null);
  const isPlaying = useBubbleStore((state) => state.isPlaying);

  const { positions, randomness } = useMemo(() => {
    const rand = seededRandom(12345);

    const positions = new Float32Array(count * 3);
    const randomness = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = rand() * 8 - 4;
      positions[i * 3 + 1] = rand() * 4 - 2;
      positions[i * 3 + 2] = rand() * 8 - 4;

      randomness[i] = rand();
    }

    return { positions, randomness };
  }, [count]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;

    const mat = pointsRef.current.material;

    // smooth fade
    mat.uniforms.uOpacity.value = THREE.MathUtils.lerp(
      mat.uniforms.uOpacity.value,
      isPlaying ? 1 : 0,
      0.05
    );

    mat.uniforms.uTime.value = clock.elapsedTime;
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aRandom", new THREE.BufferAttribute(randomness, 1));
    return geo;
  }, [positions, randomness]);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: size },
        uColor: { value: new THREE.Color(color) },
        uOpacity: { value: opacity },
        uSpeed: { value: speed },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });
  }, [size, color, opacity, speed]);

  return <points ref={pointsRef} geometry={geometry} material={material} />;
};
