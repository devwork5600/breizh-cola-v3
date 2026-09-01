import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    resolveExtensions: [
      ".tsx",
      ".ts",
      ".jsx",
      ".js",
      ".mjs",
      ".json",
      ".glsl",
      ".vs",
      ".fs",
      ".vert",
      ".frag",
    ],
    rules: {
      "*.glsl": {
        loaders: ["raw-loader"],
        as: "*.js",
      },
      "*.vs": {
        loaders: ["raw-loader"],
        as: "*.js",
      },
      "*.fs": {
        loaders: ["raw-loader"],
        as: "*.js",
      },
      "*.vert": {
        loaders: ["raw-loader"],
        as: "*.js",
      },
      "*.frag": {
        loaders: ["raw-loader"],
        as: "*.js",
      },
    },
  },
};

export default nextConfig;
