import { Book, FileText, Home, Shield, User, Users } from "lucide-react";
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

function GuestHeaderFallback() {
  const nav = getHeaderNav(false);
  return (
    <NavigationBar
      navItems={withIcons(nav.navItems)}
      pageItems={withIcons(nav.pageItems)}
      showSearch={false}
      title="ICTQuest"
      user={null}
    />
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
