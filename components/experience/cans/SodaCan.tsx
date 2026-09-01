"use client";

import { useEnvironment, useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";

// Preloading only matters for the browser - on the server this fetch is
// both pointless (nothing is displayed) and unsafe: three.js's FileLoader
// reports progress via `new ProgressEvent(...)`, which doesn't exist in
// Node and throws an unhandled rejection if this runs during SSR.
if (typeof window !== "undefined") {
  useGLTF.preload("/Soda-can.gltf");
  useEnvironment.preload({ preset: "studio" });
}

const flavorTextures = {
  original: "/labels/bz1origibal.png",
  cherry: "/labels/bz1cherry.png",
  zero: "/labels/bz1zero.png",
  lime: "/labels/bz1lime.png",
  coffee: "/labels/bz1coffee.png",
};

const metalMaterial = new THREE.MeshStandardMaterial({
  roughness: 0.35,
  metalness: 0.85,
  color: "#8c8c8c",
});

export type SodaCanProps = {
  flavor?: keyof typeof flavorTextures;
  scale?: number;
};

export function SodaCan({
  flavor = "original",
  scale = 2,
  ...props
}: SodaCanProps) {
  const { nodes } = useGLTF("/Soda-can.gltf");

  const labels = useTexture(flavorTextures);

  // Fixes upside down labels - setting flipY directly in render ensures it's applied before the first draw
  Object.values(labels).forEach((texture) => {
    texture.flipY = false;
    texture.colorSpace = THREE.SRGBColorSpace;
  });

  const label = labels[flavor];

  return (
    <group
      {...props}
      dispose={null}
      scale={scale}
      rotation={[0, -Math.PI * 1.25, 0]}
    >
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.cylinder as THREE.Mesh).geometry}
        material={metalMaterial}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.cylinder_1 as THREE.Mesh).geometry}
      >
        <meshStandardMaterial roughness={0.7} metalness={0.1} map={label} />
      </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.Tab as THREE.Mesh).geometry}
        material={metalMaterial}
      />
    </group>
  );
}
