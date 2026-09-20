import { defaultCache } from "@serwist/turbopack/worker";
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
 * Service worker (@serwist/turbopack).
 *
 * Built from app source (`swSrc`) by the route handler at
 * `src/app/serwist/[path]/route.ts` and served at `/serwist/sw.js`,
 * production-only. The precache manifest is the Turbopack build output plus
 * the public deployment-versioned set (`SW_PRECACHED_URLS`).
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
