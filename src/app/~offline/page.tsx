import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

/**
 * Offline fallback (Migration 16, #39).
 *
 * Precached by the worker (`additionalPrecacheEntries`, full wiring in #40)
 * and served for document requests when the network is unavailable. Reuses
 * the maintenance card visual language, but maintenance stays a separate
 * server-down route: this page is about connectivity, never server state.
 */
export default function OfflinePage() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center">
      <Card
        className="h-max w-max border-gray-200 bg-white text-center dark:border-gray-700 dark:bg-gray-800"
        data-testid="offline-fallback"
      >
        <CardHeader />
        <CardContent className="text-gray-900 dark:text-gray-200">
          <h1 className="font-bold text-3xl text-destructive">
            You&apos;re offline
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Check your connection and try again. Your saved progress is safe on
            this device.
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <Link
              className="rounded-md bg-indigo-600 px-4 py-2 font-medium text-sm text-white hover:bg-indigo-700"
              href="/~offline"
            >
              Try again
            </Link>
            <Link
              className="rounded-md border border-gray-300 px-4 py-2 font-medium text-sm hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
              href="/"
            >
              Go home
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
