export type HeaderNavItem = {
  href: string;
  name: string;
};

export type HeaderNav = {
  navItems: HeaderNavItem[];
  pageItems: HeaderNavItem[];
  showSearch: boolean;
};

const GUEST_NAV: HeaderNavItem[] = [
  { name: "Home", href: "/" },
  { name: "Lessons", href: "/lessons" },
];

const AUTHED_NAV: HeaderNavItem[] = [
  ...GUEST_NAV,
  { name: "Profile", href: "/profile" },
  { name: "People", href: "/social/new" },
];

/**
 * Nav visibility by session state (presentation filtering only).
 * Real authorization stays in `proxy.ts` + `permissionProcedure` —
 * this helper only decides which links the shared header renders.
 */
export function getHeaderNav(isAuthenticated: boolean): HeaderNav {
  return {
    navItems: isAuthenticated ? AUTHED_NAV : GUEST_NAV,
    pageItems: isAuthenticated
      ? [
          { name: "Terms of use", href: "/terms" },
          { name: "Privacy policy", href: "/privacy" },
        ]
      : [],
    showSearch: isAuthenticated,
  };
}
