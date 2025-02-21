"use client";

import { CommandSearch } from "@/components/command-search";
import { Button } from "@/components/ui/button";
import { Book, FileText, Menu, Moon, Shield, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  console.log(pathname);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="sticky left-0 top-0 z-[50] border-b-2 border-indigo-500/20 bg-white shadow-lg dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <Link href="/" className="flex flex-shrink-0 items-center">
                <Book className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                  ICTQuest
                </span>
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/"
                  className={`${pathname === "/" ? "border-indigo-500" : "border-transparent"} text-gray-90500 inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${pathname !== "/" && "hover:border-gray-300"} hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-200`}
                >
                  Home
                </Link>
                <Link
                  href="/lessons"
                  className={`${pathname === "/lessons" ? "border-indigo-500" : "border-transparent"} inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium text-gray-500 ${pathname !== "/lessons" && "hover:border-gray-300"} hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-200`}
                >
                  Lessons
                </Link>
                <Link
                  href="/profile"
                  className={`${pathname === "/profile" ? "border-indigo-500" : "border-transparent"} inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium text-gray-500 ${pathname !== "/profile" && "hover:border-gray-300"} hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-200`}
                >
                  Profile
                </Link>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="relative">
                <CommandSearch className="w-min" />
              </div>
              <Button
                variant="ghost"
                className="ml-3 text-gray-500 dark:text-gray-300"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            </div>
            <div className="-mr-2 flex items-center sm:hidden">
              <Button
                variant="ghost"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="sm:hidden">
            <div className="space-y-1 pb-3 pt-2">
              <div className="relative w-full px-2 mb-4">
                <CommandSearch className="w-full" />
              </div>
              <Link
                href="/"
                onClick={() =>
                  setTimeout(() => setIsMobileMenuOpen(false), 250)
                }
                className={`block border-l-4 ${pathname === "/" ? "border-indigo-500" : "border-transparent"} ${pathname === "/" ? "bg-indigo-50" : "bg-gray-50"} py-2 pl-3 pr-4 text-base font-medium ${pathname === "/" ? "text-indigo-700" : "text-gray-500"} ${pathname === "/" ? "dark:bg-indigo-900" : "dark:bg-gray-800"} ${pathname !== "/" && "hover:border-gray-300"} ${pathname !== "/" && "hover:bg-gray-50"} ${pathname !== "/" && "hover:text-gray-700"} dark:text-gray-300 ${pathname !== "/" && "dark:hover:bg-gray-700"} ${pathname !== "/" && "hover:text-gray-200"}`}
              >
                Home
              </Link>
              <Link
                href="/lessons"
                onClick={() =>
                  setTimeout(() => setIsMobileMenuOpen(false), 250)
                }
                className={`block border-l-4 ${pathname === "/lessons" ? "border-indigo-500" : "border-transparent"} ${pathname === "/lessons" ? "bg-indigo-50" : "bg-gray-50"} py-2 pl-3 pr-4 text-base font-medium ${pathname === "/lessons" ? "text-indigo-700" : "text-gray-500"} ${pathname === "/lessons" ? "dark:bg-indigo-900" : "dark:bg-gray-800"} ${pathname !== "/lessons" && "hover:border-gray-300"} ${pathname !== "/lessons" && "hover:bg-gray-50"} ${pathname !== "/lessons" && "hover:text-gray-700"} dark:text-gray-300 ${pathname !== "/lessons" && "dark:hover:bg-gray-700"} ${pathname !== "/lessons" && "hover:text-gray-200"}`}
              >
                Lessons
              </Link>
              <Link
                href="/profile"
                onClick={() =>
                  setTimeout(() => setIsMobileMenuOpen(false), 250)
                }
                className={`block border-l-4 ${pathname === "/profile" ? "border-indigo-500" : "border-transparent"} ${pathname === "/profile" ? "bg-indigo-50" : "bg-gray-50"} py-2 pl-3 pr-4 text-base font-medium ${pathname === "/profile" ? "text-indigo-700" : "text-gray-500"} ${pathname === "/profile" ? "dark:bg-indigo-900" : "dark:bg-gray-800"} ${pathname !== "/profile" && "hover:border-gray-300"} ${pathname !== "/profile" && "hover:bg-gray-50"} ${pathname !== "/profile" && "hover:text-gray-700"} dark:text-gray-300 ${pathname !== "/profile" && "dark:hover:bg-gray-700"} ${pathname !== "/profile" && "hover:text-gray-200"}`}
              >
                Profile
              </Link>
            </div>
          </div>
        )}
      </nav>

      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">{children}</div>
      </main>

      <footer className="bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <Link
              href="/terms"
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <span className="sr-only">Terms of Use</span>
              <FileText className="h-6 w-6" />
            </Link>
            <Link
              href="/privacy"
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <span className="sr-only">Privacy Policy</span>
              <Shield className="h-6 w-6" />
            </Link>
          </div>
          <div className="mt-8 md:order-1 md:mt-0">
            <p className="text-center text-base text-gray-400 dark:text-gray-300">
              &copy; 2025 ICTQuest. All rights reserved.{" "}
              <Link
                className="text-indigo-500"
                href={"https://github.com/Jasmyre/ictquest"}
              >
                View Source Code
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
