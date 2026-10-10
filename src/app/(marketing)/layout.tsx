import type { ReactNode } from "react";
import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header-async";

/**
 * Minimal public shell for `(marketing)` (ADR 0003): landing, terms, privacy.
 * Renders the same shared session-aware site header as `(app)` — guests
 * see Home + Lessons only, signed-in visitors see the full nav. The
 * lessons tree lives in `(app)` on purpose, so the Lessons link bounces
 * guests to `/auth` via the guard in `src/proxy.ts`.
 */
export default function MarketingLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SiteHeader />
      <main
        className="mx-auto max-w-7xl scroll-mt-16 px-4 py-6"
        id="main-content"
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
