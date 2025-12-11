import { FileText, Shield } from "lucide-react";
import Link from "next/link";
import type { JSX } from "react";
import { cn } from "@/lib/utils";

export async function Footer(): Promise<JSX.Element> {
  return (
    <footer
      className={cn(
        "bg-white dark:bg-gray-800",
        process.env.NEXT_IS_IN_MAINTENANCE === "true" ? "hidden" : ""
      )}
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          <Link
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            href="/terms"
          >
            <span className="sr-only">Terms of Use</span>
            <FileText className="h-6 w-6" />
          </Link>
          <Link
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            href="/privacy"
          >
            <span className="sr-only">Privacy Policy</span>
            <Shield className="h-6 w-6" />
          </Link>
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-center text-base text-gray-400 dark:text-gray-300">
            &copy; 2025 ICTQuest. All rights reserved.
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
  );
}
