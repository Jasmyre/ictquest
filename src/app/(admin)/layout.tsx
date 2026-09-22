import {
  Award,
  BarChart3,
  BookOpen,
  LayoutDashboard,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { Suspense } from "react";
import { auth } from "@/auth";
import { getUserRoleNames, hasRole } from "@/lib/roles";

const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/lessons", label: "Lessons", icon: BookOpen },
  { href: "/admin/achievements", label: "Achievements", icon: Award },
  { href: "/admin/progress", label: "Progress", icon: BarChart3 },
];

/**
 * Separate admin shell for `(admin)` (ADR 0003, #34).
 *
 * Own sidebar chrome — never the public minimal shell, never the
 * authenticated full app chrome, so admin work stays focused and
 * public nav never leaks in. Every admin path requires a session plus the
 * ADMIN role: `proxy.ts` redirects unauthenticated callers to `/auth` and
 * non-admins to `/`, and this layout re-checks the same rule so direct
 * renders stay denied even if the proxy is bypassed in tests.
 * MODERATOR intentionally has zero routes here (reserved).
 *
 * Cache Components: the shell (sidebar chrome) is static and prerenders;
 * the per-request session/role gate streams inside Suspense so admin routes
 * stay dynamically gated without blocking the static shell.
 */
export default function AdminLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div
      className="min-h-screen bg-gray-50 dark:bg-gray-900"
      data-testid="admin-shell"
    >
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <aside
          aria-label="Admin navigation"
          className="w-60 shrink-0 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="mb-4 flex items-center gap-2 px-2">
            <ShieldCheck className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <span className="font-semibold text-gray-900 text-sm dark:text-white">
              Admin
            </span>
          </div>
          <nav className="flex flex-col gap-1">
            {ADMIN_NAV.map((item) => (
              <Link
                className="flex items-center gap-2 rounded-md px-3 py-2 font-medium text-gray-600 text-sm hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                href={item.href}
                key={item.href}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 border-gray-200 border-t pt-4 dark:border-gray-700">
            <Link
              className="block rounded-md px-3 py-2 text-gray-500 text-sm hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
              href="/"
            >
              Back to site
            </Link>
          </div>
        </aside>
        <main className="min-w-0 flex-1">
          <Suspense fallback={<p>Checking admin access…</p>}>
            <AdminGuard>{children}</AdminGuard>
          </Suspense>
        </main>
      </div>
    </div>
  );
}

async function AdminGuard({ children }: Readonly<{ children: ReactNode }>) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth");
  }

  // Authoritative per-request check: session `roles[]` is JWT-stamped at
  // sign-in/refresh and goes stale after a grant/revoke, so admin paths
  // re-read memberships from the DB. Non-admin paths keep the JWT copy
  // to avoid a DB read on every request.
  let roles = session.user.roles;
  if (session.user.id) {
    try {
      roles = await getUserRoleNames(session.user.id);
    } catch {
      roles = session.user.roles;
    }
  }

  if (!hasRole(roles, "ADMIN")) {
    redirect("/");
  }

  return <>{children}</>;
}
