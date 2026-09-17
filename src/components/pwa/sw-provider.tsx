"use client";

import { SerwistProvider } from "@serwist/next/react";
import type { ReactNode } from "react";

/**
 * Non-cached client boundary for worker registration (Migration 16, #39).
 *
 * The root layout is a cached (`"use cache"`) server segment, so SW
 * registration must live in a client component: `SerwistProvider` only
 * touches `window`/`navigator` on the client and no-ops on the server.
 * `reloadOnOnline` stays `false` so a reconnect never wipes in-progress
 * quiz/form state; registration itself is disabled outside production to
 * avoid dev cache hell. The full worker build (swSrc/swDest, precache,
 * cache rules) lands in #40 — this only wires the provider at `/sw.js`.
 */
export function SwProvider({
  children,
  swUrl = "/sw.js",
}: Readonly<{ children: ReactNode; swUrl?: string }>) {
  return (
    <SerwistProvider
      disable={process.env.NODE_ENV !== "production"}
      reloadOnOnline={false}
      swUrl={swUrl}
    >
      {children}
    </SerwistProvider>
  );
}
