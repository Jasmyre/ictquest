/**
 * Single design-system source for header spacing/typography.
 * Imported by the server `HeaderShell` (both static-fallback and
 * interactive branches) and by the client islands, so prerender output
 * and post-stream output are dimensionally identical by construction.
 */

export const HEADER_BAR =
  "fixed top-0 right-0 left-0 z-50 border-gray-300 border-b bg-card dark:border-muted";

export const HEADER_CONTAINER = "container mx-auto max-w-7xl";

export const HEADER_ROW = "flex h-14 items-center justify-between px-4";

export const HEADER_LEFT = "flex items-center space-x-6";

export const BRAND_LINK =
  "cursor-pointer font-bold text-xl opacity-90 transition-all duration-200 hover:opacity-100";

export const BRAND_INNER = "flex gap-2";

export const DESKTOP_NAV = "hidden items-center lg:flex";

export function desktopNavLink(pathname: string, href: string): string {
  const isOnPath = pathname.includes(href);
  const isExact = href === pathname;
  let tone = "border-transparent";
  if (isOnPath && !isExact) {
    tone = "";
  }
  if (isExact) {
    tone = "border-indigo-500";
  }
  return `group ${tone} inline-flex h-10 w-max cursor-pointer items-center justify-center rounded-none border-b bg-card px-3 py-2 font-medium text-sm opacity-80 transition-all duration-200 hover:rounded-md hover:bg-muted hover:text-muted-foreground hover:opacity-100 focus:rounded-md focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50`;
}

export const NAV_LINK_INNER =
  "flex items-center gap-2 transition-transform duration-200";

export const NAV_LINK_ICON =
  "transition-transform duration-200 group-hover:scale-110";

export const DESKTOP_ACTIONS = "hidden items-center space-x-1 lg:flex";

export const MOBILE_ACTIONS = "flex items-center space-x-2 lg:hidden";

export const HEADER_SPACER = "h-14";
