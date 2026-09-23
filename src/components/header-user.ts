export type HeaderUser = {
  name?: string | null;
  image?: string | null;
};

const WHITESPACE = /\s+/;

export function getInitials(name?: string | null): string {
  const fallback = name ?? "Account";
  const parts = fallback.trim().split(WHITESPACE);
  if (parts.length === 1) {
    return (parts[0]?.slice(0, 2) ?? "AC").toUpperCase();
  }
  return `${parts[0]?.[0] ?? "A"}${parts.at(-1)?.[0] ?? "C"}`.toUpperCase();
}
