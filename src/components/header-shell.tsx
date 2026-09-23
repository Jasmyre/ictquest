import { Menu, Search, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeaderActions } from "./header-actions";
import { HeaderIcon } from "./header-icon";
import { HeaderNavLinks } from "./header-nav-links";
import {
  BRAND_INNER,
  BRAND_LINK,
  DESKTOP_ACTIONS,
  DESKTOP_NAV,
  desktopNavLink,
  HEADER_BAR,
  HEADER_CONTAINER,
  HEADER_LEFT,
  HEADER_ROW,
  HEADER_SPACER,
  MOBILE_ACTIONS,
  NAV_LINK_ICON,
  NAV_LINK_INNER,
} from "./header-tokens";
import type { HeaderUser } from "./header-user";
import type { HeaderNavItem } from "./site-header";

export type HeaderShellProps = {
  navItems: HeaderNavItem[];
  pageItems: HeaderNavItem[];
  showSearch: boolean;
  title: string;
  user: HeaderUser | null;
  /**
   * `static` renders hook-free markup for the prerender fallback
   * (no client island may run there — `usePathname` would block
   * prerendering with `cacheComponents`). Same tokens, same classes,
   * same dimensions as `interactive`; only behavior is missing.
   */
  mode?: "static" | "interactive";
};

/**
 * Single static header layout shared by the prerender fallback and the
 * streamed session-aware result — one design system, one set of spacings.
 *
 * No breadcrumbs, no hide-on-scroll: the bar is permanently visible and
 * the spacer is always `h-14`, so first paint and post-stream are
 * dimensionally identical.
 */
export function HeaderShell({
  navItems,
  pageItems,
  showSearch,
  title,
  user,
  mode = "interactive",
}: HeaderShellProps) {
  const interactive = mode === "interactive";

  return (
    <>
      <header className={HEADER_BAR}>
        <div className={HEADER_CONTAINER}>
          <div className={HEADER_ROW}>
            <div className={HEADER_LEFT}>
              <Link className={BRAND_LINK} href="/">
                <span className={BRAND_INNER}>
                  <Image
                    alt="Website logo"
                    className="h-8 w-8"
                    height={100}
                    src="/logo.svg"
                    width={100}
                  />
                  {title}
                </span>
              </Link>
              {interactive ? (
                <HeaderNavLinks items={navItems} />
              ) : (
                <nav aria-label="Primary" className={DESKTOP_NAV}>
                  {navItems.map((item) => (
                    <Link
                      className={desktopNavLink("", item.href)}
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
              )}
            </div>
            {interactive ? (
              <HeaderActions
                navItems={navItems}
                pageItems={pageItems}
                showSearch={showSearch}
                title={title}
                user={user}
              />
            ) : (
              <>
                <div className={DESKTOP_ACTIONS}>
                  {showSearch ? (
                    <Button
                      aria-label="Search"
                      className="relative cursor-pointer opacity-70 transition-all duration-200 hover:opacity-100"
                      size="icon"
                      variant="ghost"
                    >
                      <Search className="h-4 w-4 transition-transform duration-200" />
                      <span className="sr-only">Search</span>
                    </Button>
                  ) : null}
                  <Button
                    aria-label="Toggle theme"
                    className="cursor-pointer opacity-70 transition-all duration-200 hover:opacity-100"
                    size="icon"
                    variant="ghost"
                  >
                    <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-300" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/auth">Sign in</Link>
                  </Button>
                </div>
                <div className={MOBILE_ACTIONS}>
                  {showSearch ? (
                    <Button
                      aria-label="Search"
                      className="cursor-pointer opacity-70 transition-all duration-200 hover:opacity-100"
                      size="icon"
                      variant="ghost"
                    >
                      <Search className="h-4 w-4 transition-transform duration-200" />
                      <span className="sr-only">Search</span>
                    </Button>
                  ) : null}
                  <Button
                    aria-label="Toggle theme"
                    className="cursor-pointer opacity-70 transition-all duration-200 hover:opacity-100"
                    size="icon"
                    variant="ghost"
                  >
                    <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-300" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                  <Button
                    aria-label="Toggle navigation menu"
                    className="cursor-pointer opacity-70 transition-all duration-200 hover:opacity-100"
                    size="icon"
                    variant="ghost"
                  >
                    <Menu className="h-6 w-6 transition-transform duration-200" />
                    <span className="sr-only">Toggle navigation menu</span>
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>
      {/* Spacer for the fixed header — always h-14, matching the bar. */}
      <div className={HEADER_SPACER} />
    </>
  );
}
