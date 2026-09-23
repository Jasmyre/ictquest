import { Book, FileText, Home, Shield, User, Users } from "lucide-react";
import type { HeaderIconName } from "./site-header";

const ICONS = {
  home: Home,
  lessons: Book,
  profile: User,
  people: Users,
  terms: FileText,
  privacy: Shield,
} as const;

/**
 * Server-safe icon resolver: the nav model carries serializable
 * `HeaderIconName`s so the server shell and client islands share one
 * contract (no ReactNodes crossing the server/client boundary).
 */
export function HeaderIcon({
  name,
  className,
}: {
  name: HeaderIconName;
  className?: string;
}) {
  const Icon = ICONS[name];
  return <Icon className={className} />;
}
