import { Book, FileText, Home, Shield, User, Users } from "lucide-react";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { auth } from "@/auth";
import { NavigationBar } from "@/components/ui/navigation-bar";
import { getHeaderNav, type HeaderNavItem } from "./site-header";

function withIcons(items: HeaderNavItem[]) {
  return items.map((item) => {
    switch (item.name) {
      case "Home":
        return { ...item, icon: <Home /> };
      case "Lessons":
        return { ...item, icon: <Book /> };
      case "Profile":
        return { ...item, icon: <User /> };
      case "People":
        return { ...item, icon: <Users /> };
      case "Terms of use":
        return { ...item, icon: <FileText /> };
      case "Privacy policy":
        return { ...item, icon: <Shield /> };
      default:
        return item;
    }
  });
}

/**
 * Static prerender-safe fallback: plain server markup with no client hooks
 * (`usePathname` inside `NavigationBar` would block prerendering with
 * `cacheComponents`). Reserves the fixed-header space so the streamed
 * session-aware bar swaps in without layout shift.
 */
function GuestHeaderFallback() {
  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-50 hidden border-gray-300 border-b bg-card lg:block">
        <div className="container mx-auto max-w-7xl">
          <div className="flex h-14 items-center justify-between px-4">
            <Link
              className="font-bold text-xl opacity-90"
              href="/"
              prefetch={false}
            >
              ICTQuest
            </Link>
            <nav className="flex items-center gap-6 text-sm">
              <Link className="font-medium opacity-80" href="/">
                Home
              </Link>
              <Link
                className="font-medium opacity-80"
                href="/lessons"
                prefetch={false}
              >
                Lessons
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <div className="h-14" />
    </>
  );
}

async function SiteHeaderInner() {
  await connection();
  const session = await auth().catch(() => null);
  const isAuthenticated = session !== null;
  const nav = getHeaderNav(isAuthenticated);

  return (
    <NavigationBar
      navItems={withIcons(nav.navItems)}
      pageItems={withIcons(nav.pageItems)}
      showSearch={nav.showSearch}
      title="ICTQuest"
      user={
        session?.user
          ? {
              name: session.user.name,
              image: session.user.image,
            }
          : null
      }
    />
  );
}

/**
 * Shared session-aware site header (PPR dynamic hole).
 * Static shell prerenders the guest-limited bar; the signed-in
 * full nav + real identity streams in once the session resolves.
 * Never call `auth()` in a layout — always render this inside `<Suspense>`.
 */
export function SiteHeader() {
  return (
    <Suspense fallback={<GuestHeaderFallback />}>
      <SiteHeaderInner />
    </Suspense>
  );
}
