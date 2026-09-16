import { Book, FileText, Home, Shield, User, Users } from "lucide-react";
import type { ReactNode } from "react";
import { Suspense } from "react";
import { Footer } from "@/components/footer";
import type { NavItem } from "@/components/ui/navigation-bar";
import { NavigationBar } from "@/components/ui/navigation-bar";

/**
 * Full authenticated shell for `(app)` (ADR 0003): lesson details, lesson
 * subtopic, progress, profile, user pages, social (+ mock social-new),
 * compliments, settings. Requires auth via `proxy.ts`; renders the full
 * nav-plus-footer chrome.
 */
export default function AppLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-screen">
      <Suspense>
        <NavigationBar
          enableBlock={true}
          navItems={getNavItems()}
          pageItems={getPageItems()}
          title="ICTQuest"
        />
      </Suspense>
      <main className="mx-auto max-w-7xl px-4 py-6 dark:bg-gray-900">
        {children}
      </main>
      <Footer />
    </div>
  );
}

function getNavItems(): NavItem[] {
  return [
    {
      name: "Home",
      href: "/",
      icon: <Home />,
    },
    {
      name: "Lessons",
      href: "/lessons",
      icon: <Book />,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: <User />,
    },
    {
      name: "People",
      href: "/social/new",
      icon: <Users />,
    },
  ];
}

function getPageItems() {
  return [
    {
      name: "Terms of use",
      href: "/terms",
      icon: <FileText />,
    },
    {
      name: "Privacy policy",
      href: "/privacy",
      icon: <Shield />,
    },
  ];
}
