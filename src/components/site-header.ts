export type HeaderIconName =
  | "home"
  | "lessons"
  | "profile"
  | "people"
  | "admin"
  | "terms"
  | "privacy";

export type HeaderNavItem = {
  href: string;
  name: string;
  icon: HeaderIconName;
};

export type HeaderNav = {
  navItems: HeaderNavItem[];
  pageItems: HeaderNavItem[];
  showSearch: boolean;
};

const GUEST_NAV: HeaderNavItem[] = [
  { name: "Home", href: "/landing", icon: "home" },
  { name: "Lessons", href: "/lessons", icon: "lessons" },
];

const AUTHED_NAV: HeaderNavItem[] = [
  { name: "Home", href: "/", icon: "home" },
  { name: "Lessons", href: "/lessons", icon: "lessons" },
  { name: "Profile", href: "/profile", icon: "profile" },
  { name: "People", href: "/social/new", icon: "people" },
];

const ADMIN_NAV_ITEM: HeaderNavItem = {
  name: "Admin",
  href: "/admin",
  icon: "admin",
};

/**
 * Nav visibility by session state (presentation filtering only).
 * Real authorization stays in `proxy.ts` + `permissionProcedure` —
 * this helper only decides which links the shared header renders.
 * Icons are serializable names (not ReactNodes) so the server shell
 * and client islands share one contract.
 *
 * The `Admin` entry is ABAC-gated: callers must pass
 * `canManageAdmin = hasPermission(user, "Admin", "manage")` (fresh
 * roles per the session-freshness rule). Never gate it on
 * `isAuthenticated` alone.
 */
export function getHeaderNav(
  isAuthenticated: boolean,
  canManageAdmin = false
): HeaderNav {
  const navItems = isAuthenticated ? [...AUTHED_NAV] : [...GUEST_NAV];
  if (isAuthenticated && canManageAdmin) {
    navItems.push(ADMIN_NAV_ITEM);
  }
  return {
    navItems,
    pageItems: isAuthenticated
      ? [
          { name: "Terms of use", href: "/terms", icon: "terms" },
          { name: "Privacy policy", href: "/privacy", icon: "privacy" },
        ]
      : [],
    showSearch: isAuthenticated,
  };
}
