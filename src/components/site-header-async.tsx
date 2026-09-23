import { connection } from "next/server";
import { Suspense } from "react";
import { auth } from "@/auth";
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
  const nav = getHeaderNav(isAuthenticated);

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
