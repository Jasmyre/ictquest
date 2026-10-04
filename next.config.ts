/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";
import os from "node:os";
import { withSerwist } from "@serwist/turbopack";
import type { NextConfig } from "next";

function getLocalIP() {
  const interfaces = os.networkInterfaces();

  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name] || []) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }

  return "localhost";
}

const localIP = getLocalIP();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  cacheComponents: true,
  reactCompiler: true,
  allowedDevOrigins: [localIP],
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
 * Service-worker build (@serwist/turbopack).
 *
 * The Turbopack-native wrapper around the framework config: no webpack
 * plugin, no Turbopack warning to suppress. The worker itself is built from
 * app source (`src/app/sw.ts`) by the route handler at
 * `src/app/serwist/[path]/route.ts` and served at `/serwist/sw.js`
 * (registered production-only by `SwProvider` to avoid dev cache hell).
 * `reloadOnOnline` stays `false` in `SwProvider` so a reconnect never wipes
 * in-progress quiz/form state.
 */
export default async function config(): Promise<NextConfig> {
  // Skip env validation during tests or when explicitly requested
  if (process.env.NODE_ENV !== "test" && !process.env.SKIP_ENV_VALIDATION) {
    await import("./src/env.js");
  }

  return withSerwist(nextConfig);
}
