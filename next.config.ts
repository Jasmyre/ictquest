/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */

import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import withSerwistInit from "@serwist/next";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  cacheComponents: true,
  reactCompiler: true,
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  logging: {
    fetches: {
      fullUrl: true,
      hmrRefreshes: true,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fonts.gstatic.com",
        port: "",
        pathname: "/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "loremflickr.com",
        port: "",
        pathname: "/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "loremflickr.com",
        port: "",
        pathname: "/cache/resized/**",
        search: "",
      },
    ],
  },
};

/**
 * Service-worker build (Migration 17, #40).
 *
 * Serwist wrapper around the framework config emitting the worker from app
 * source (`src/app/sw.ts`) to public output (`public/sw.js`), disabled
 * outside production to avoid dev cache hell. App shell route (`/`) plus
 * offline (`/~offline`) are precached keyed by source revision (`git rev-parse
 * HEAD` with UUID fallback); `globPublicPatterns` precaches favicon plus PWA
 * assets. `reloadOnOnline` stays `false` in `SwProvider` so a reconnect never
 * wipes in-progress quiz/form state.
 */
const revision =
  spawnSync("git", ["rev-parse", "HEAD"], {
    encoding: "utf-8",
  }).stdout?.trim() || randomUUID();

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  additionalPrecacheEntries: [
    { url: "/", revision },
    { url: "/~offline", revision },
  ],
  globPublicPatterns: ["favicon.ico", "pwa/*.{png,svg}"],
  disable: process.env.NODE_ENV !== "production",
});

export default async function config(): Promise<NextConfig> {
  // Skip env validation during tests or when explicitly requested
  if (process.env.NODE_ENV !== "test" && !process.env.SKIP_ENV_VALIDATION) {
    await import("./src/env.js");
  }

  return withSerwist(nextConfig);
}
