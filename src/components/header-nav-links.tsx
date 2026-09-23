"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeaderIcon } from "./header-icon";
import {
  DESKTOP_NAV,
  desktopNavLink,
  NAV_LINK_ICON,
  NAV_LINK_INNER,
} from "./header-tokens";
import type { HeaderNavItem } from "./site-header";

/**
 * Client island: desktop primary links with pathname-aware active state.
 * Hidden below `lg` — mobile navigation lives in `MobileMenu`.
 */
export function HeaderNavLinks({ items }: { items: HeaderNavItem[] }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className={DESKTOP_NAV}>
      {items.map((item) => (
        <Link
          className={desktopNavLink(pathname, item.href)}
          href={item.href}
          key={item.href}
        >
          <span className={NAV_LINK_INNER}>
            <span className={NAV_LINK_ICON}>
              <HeaderIcon name={item.icon} />
            </span>
            {item.name}
          </span>
        </Link>
      ))}
    </nav>
  );
}
