import {
  Award,
  BarChart3,
  BookOpen,
  LayoutDashboard,
  Users,
} from "lucide-react";
import { type ReactNode, Suspense } from "react";
import { AdminGuard } from "@/components/admin-guard";
import { AdminShell } from "@/components/admin-shell";
import { AdminShellAsync } from "@/components/admin-shell-async";
import type { NavMainItem } from "@/components/nav-main";

const adminNavItems: NavMainItem[] = [
  {
    icon: <LayoutDashboard className="h-4 w-4" />,
    title: "Dashboard",
    url: "/admin",
  },
  {
    icon: <Users className="h-4 w-4" />,
    title: "Users",
    url: "/admin/users",
  },
  {
    icon: <BookOpen className="h-4 w-4" />,
    title: "Lessons",
    url: "/admin/lessons",
  },
  {
    icon: <Award className="h-4 w-4" />,
    title: "Achievements",
    url: "/admin/achievements",
  },
  {
    icon: <BarChart3 className="h-4 w-4" />,
    title: "Progress",
    url: "/admin/progress",
  },
];

/**
 * Admin shell for `(admin)` (ADR 0003, #34).
 *
 * Sidebar chrome via `MainSidebar` (`AdminShell`/`AdminShellAsync`,
 * `groupLabel="Admin"`); every admin path requires a session plus the ADMIN
 * role: `proxy.ts` redirects unauthenticated callers to `/auth` and
 * non-admins to `/`, and `AdminGuard` re-checks the same rule per request
 * with a fresh role/suspension read so direct renders stay denied even if
 * the proxy is bypassed in tests. MODERATOR intentionally has zero routes
 * here (reserved).
 *
 * Cache Components: the shell (sidebar chrome) is static and prerenders;
 * the per-request session/role gate streams inside Suspense so admin routes
 * stay dynamically gated without blocking the static shell. The fallback is
 * the static admin shell, not `null` — a `null` fallback committed a blank
 * frame on soft navigations while the gate resolved.
 */
export default function AdminLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-svh bg-background" data-testid="admin-shell">
      <Suspense
        fallback={
          <AdminShell navItems={adminNavItems}>
            <main className="flex-1 p-4">
              <p>Loading admin…</p>
            </main>
          </AdminShell>
        }
      >
        <AdminGuard>
          <AdminShellAsync navItems={adminNavItems}>{children}</AdminShellAsync>
        </AdminGuard>
      </Suspense>
    </div>
  );
}
