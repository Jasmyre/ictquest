"use client";

import { SerwistProvider } from "@serwist/turbopack/react";
import type { ReactNode } from "react";

/**
 * Non-cached client boundary for worker registration (Migration 16, #39).
 *
 * The root layout is a cached (`"use cache"`) server segment, so SW
 * registration must live in a client component: `SerwistProvider` only
 * touches `window`/`navigator` on the client and no-ops on the server.
 * `reloadOnOnline` stays `false` so a reconnect never wipes in-progress
 * quiz/form state; registration itself is disabled outside production to
 * avoid dev cache hell, except when explicitly opted in for LAN install
 * testing (`NEXT_PUBLIC_SW_IN_DEV=1` via `dev:https:lan:sw`). The worker
 * is built by the Serwist route handler
 * (`src/app/serwist/[path]/route.ts`) and served at `/serwist/sw.js`.
 */
export function SwProvider({
  children,
  swUrl = "/serwist/sw.js",
}: Readonly<{ children: ReactNode; swUrl?: string }>) {
  const disable =
    process.env.NODE_ENV !== "production" &&
    process.env.NEXT_PUBLIC_SW_IN_DEV !== "1";
  return (
    <SerwistProvider disable={disable} reloadOnOnline={false} swUrl={swUrl}>
      {children}
    </SerwistProvider>
  );
}
