export type HeaderIconName =
  | "home"
  | "lessons"
  | "profile"
  | "people"
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
  { name: "Home", href: "/", icon: "home" },
  { name: "Lessons", href: "/lessons", icon: "lessons" },
];

const AUTHED_NAV: HeaderNavItem[] = [
  ...GUEST_NAV,
  { name: "Profile", href: "/profile", icon: "profile" },
  { name: "People", href: "/social/new", icon: "people" },
];

/**
 * Nav visibility by session state (presentation filtering only).
 * Real authorization stays in `proxy.ts` + `permissionProcedure` —
 * this helper only decides which links the shared header renders.
 * Icons are serializable names (not ReactNodes) so the server shell
 * and client islands share one contract.
 */
export function getHeaderNav(isAuthenticated: boolean): HeaderNav {
  return {
    navItems: isAuthenticated ? AUTHED_NAV : GUEST_NAV,
    pageItems: isAuthenticated
      ? [
          { name: "Terms of use", href: "/terms", icon: "terms" },
          { name: "Privacy policy", href: "/privacy", icon: "privacy" },
        ]
      : [],
    showSearch: isAuthenticated,
  };
}
