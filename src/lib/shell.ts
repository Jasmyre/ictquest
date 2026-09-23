import type { Session } from "next-auth";
import type { NavUserData } from "@/components/nav-user";

export function getSectionTitle(
  pathname: string,
  sectionTitleMap: Record<string, string>,
  fallback: string
): string {
  const direct = sectionTitleMap[pathname];
  if (direct) {
    return direct;
  }
  // Longest-prefix match so nested routes resolve to their section
  // (e.g. `/admin/users/123` → "Users"), mirroring the nav highlight rule.
  let best: string | undefined;
  let bestLength = -1;
  for (const [prefix, title] of Object.entries(sectionTitleMap)) {
    if (
      (pathname === prefix || pathname.startsWith(`${prefix}/`)) &&
      prefix.length > bestLength
    ) {
      best = title;
      bestLength = prefix.length;
    }
  }
  if (best) {
    return best;
  }
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) {
    return fallback;
  }
  const last = segments.at(-1) ?? fallback;
  return last.charAt(0).toUpperCase() + last.slice(1).replace(/-/g, " ");
}

export function mapSessionToNavUser(
  user: Session["user"] | undefined
): NavUserData | null {
  if (!user) {
    return null;
  }
  return {
    email: user.email ?? "",
    image: user.image,
    userName: user.name ?? user.email ?? "",
  };
}
