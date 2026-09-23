import type { ReactNode } from "react";
import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header-async";

/**
 * Full authenticated shell for `(app)` (ADR 0003): lesson details, lesson
 * subtopic, progress, profile, user pages, social (+ mock social-new),
 * compliments, settings. Requires auth via `proxy.ts`; renders the shared
 * session-aware site header plus footer.
 */
export default function AppLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-6 dark:bg-gray-900">
        {children}
      </main>
      <Footer />
    </div>
  );
}
