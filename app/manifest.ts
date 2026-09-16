import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Breizh Cola - Boissons Originales",
    short_name: "Breizh Cola",
    description:
      "Breizh Cola - Découvrez nos boissons originales: Cherry, Zero, Lime et plus encore.",
    start_url: "/",
    display: "standalone",
    background_color: "#591420",
    theme_color: "#f5ddd2",
    icons: [
      {
        src: "/icons/pwa/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/pwa/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/pwa/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
