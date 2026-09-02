"use client";

import { useEnvironment, useGLTF, useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
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
  const { gl } = useThree();

  const labels = useTexture(flavorTextures);

  // Fixes upside down labels - setting flipY directly in render ensures it's applied before the first draw
  Object.values(labels).forEach((texture) => {
    texture.flipY = false;
    texture.colorSpace = THREE.SRGBColorSpace;
    // Default anisotropy (1, i.e. off) undersamples this label at the
    // grazing angles the cylinder wrap constantly presents, which shows up
    // as dark, blocky mip-level noise near the can's edges - most visible
    // where it overlaps the z-fighting seam above.
    texture.anisotropy = gl.capabilities.getMaxAnisotropy();
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
        {/* The label is a second, separate mesh laid directly over the can
            body (only ~0.75% larger in radius) rather than baked into one
            surface. At glancing angles - near the can's silhouette, or as
            it rotates in FloatingCan's <Float> - that tiny gap falls
            within the depth buffer's precision limit and the two meshes
            z-fight, flickering between which one wins per-pixel: the
            intermittent dashed/checkerboard-of-black-squares artifact
            along the can's edge. polygonOffset nudges this mesh's
            depth-buffer value slightly closer to the camera (independent
            of its actual geometry) so it always wins the depth test
            against the body underneath it. */}
        <meshStandardMaterial
          roughness={0.7}
          metalness={0.1}
          map={label}
          polygonOffset
          polygonOffsetFactor={-4}
          polygonOffsetUnits={-4}
        />
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
