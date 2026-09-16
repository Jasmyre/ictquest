import { Book } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Footer } from "@/components/footer";

/**
 * Minimal public shell for `(marketing)` (ADR 0003): root, lessons index
 * (exact only), terms, privacy. No login, no full nav — just brand links
 * plus the public footer so visitors can evaluate the app.
 */
export default function MarketingLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="border-indigo-500/20 border-b-2 bg-white shadow-lg dark:bg-gray-800">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link className="flex flex-shrink-0 items-center" href="/">
            <Book className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            <span className="ml-2 font-bold text-gray-900 text-xl dark:text-white">
              ICTQuest
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link
              className="font-medium text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-200"
              href="/"
            >
              Home
            </Link>
            <Link
              className="font-medium text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-200"
              href="/lessons"
            >
              Lessons
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
      <Footer />
    </div>
  );
}
