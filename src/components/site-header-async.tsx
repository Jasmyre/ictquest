import { connection } from "next/server";
import { Suspense } from "react";
import { auth } from "@/auth";
import { getUserRoleNames, isUserSuspended } from "@/lib/roles";
import { hasPermission } from "@/server/permissions";
import { HeaderShell } from "./header-shell";
import { getHeaderNav } from "./site-header";

/**
 * Static prerender-safe fallback: the SAME `HeaderShell` the streamed
 * result renders, with guest props in `static` mode (no client islands —
 * `usePathname` there would block prerendering with `cacheComponents`).
 * Same tokens, same dimensions: first paint and post-stream are identical.
 */
function GuestHeaderFallback() {
  const nav = getHeaderNav(false);
  return (
    <HeaderShell
      mode="static"
      navItems={nav.navItems}
      pageItems={nav.pageItems}
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

  // ABAC gate for the Admin nav entry: `hasPermission(user, "Admin",
  // "manage")` over fresh memberships (session-freshness rule) with
  // session fallback. Suspended users never see it. Presentation only —
  // `AdminGuard` + `permissionProcedure` still enforce the route.
  let canManageAdmin = false;
  if (session?.user) {
    const userId = session.user.id;
    let suspended = session.user.suspended === true;
    if (userId) {
      try {
        suspended = await isUserSuspended(userId);
      } catch {
        suspended = session.user.suspended === true;
      }
    }
    if (!suspended) {
      let roles = session.user.roles;
      if (userId) {
        try {
          roles = await getUserRoleNames(userId);
        } catch {
          roles = session.user.roles;
        }
      }
      canManageAdmin = hasPermission({ id: userId, roles }, "Admin", "manage");
    }
  }

  const nav = getHeaderNav(isAuthenticated, canManageAdmin);

  return (
    <HeaderShell
      navItems={nav.navItems}
      pageItems={nav.pageItems}
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
