import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { NetworkOnly, Serwist } from "serwist";

// This declares the value of `injectionPoint` to TypeScript.
// `injectionPoint` is the string that will be replaced by the
// actual precache manifest. By default, this string is set to
// `"self.__SW_MANIFEST"`.
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

/**
 * Service worker (Migration 17, #40).
 *
 * Built from app source (`swSrc`) to public output (`swDest`) via
 * `withSerwistInit` in `next.config.ts`, production-only. Shell plus offline
 * (`/` and `/~offline`) are precached by source revision; favicon plus PWA
 * assets come from `globPublicPatterns`.
 *
 * Cache rules: mutations/POSTs and heavy lesson media stay `NetworkOnly`
 * (never serve stale); document requests fall back to `/~offline`.
 *
 * Lesson-body caching is deferred and per-user only, never public: no
 * lesson-body precache and no public lesson cache rule live here.
 */
const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    {
      // Mutations/POSTs (tRPC progress/unlock, social-new mock, all
      // non-GET traffic) never serve stale.
      matcher: ({ request }) => request.method !== "GET",
      handler: new NetworkOnly(),
    },
    {
      // Heavy lesson media: never blindly cache video.
      matcher: /\/lessons\/video\/.*/i,
      handler: new NetworkOnly(),
    },
    {
      matcher: /\.(?:mp4|webm)$/i,
      handler: new NetworkOnly(),
    },
    ...defaultCache,
  ],
  fallbacks: {
    entries: [
      {
        url: "/~offline",
        matcher({ request }) {
          return request.destination === "document";
        },
      },
    ],
  },
});

serwist.addEventListeners();
