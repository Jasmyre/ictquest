import Link from "next/link";
import { api } from "@/trpc/server";

/**
 * Admin home (`/admin`, ADR 0003, #34).
 *
 * Overview with live counts plus shortcuts into each management area.
 * Requires ADMIN via the `(admin)` layout plus the `proxy.ts` guard.
 */
export default async function AdminHomePage() {
  const [users, achievements, lessons] = await Promise.all([
    api.admin.listUsers({ take: 1 }).catch(() => null),
    api.admin.listAchievementDefinitions({ take: 1 }).catch(() => null),
    api.admin.listLessonContent().catch(() => null),
  ]);

  const cards = [
    {
      href: "/admin/users",
      title: "Users",
      description: "Edit roles (button radios) and suspend accounts.",
      stat: users?.success ? `${users.data.length} shown` : "—",
    },
    {
      href: "/admin/achievements",
      title: "Achievements",
      description: "Create, edit, and delete learner goals.",
      stat: achievements?.success ? `${achievements.data.length} shown` : "—",
    },
    {
      href: "/admin/progress",
      title: "Progress",
      description: "Grant, revoke, and reset learner progress.",
      stat: users?.success ? `${users.data.length} users` : "—",
    },
    {
      href: "/admin/lessons",
      title: "Lessons",
      description: "Browse MDX curriculum (read-only by design).",
      stat: lessons?.success ? `${lessons.data.length} entries` : "—",
    },
  ];

  return (
    <div className="w-full min-w-0 flex-1 space-y-4 p-4 lg:px-8">
      <h1 className="sr-only">Admin Dashboard</h1>
      <ul className="grid gap-3 sm:grid-cols-2">
        {cards.map((card) => (
          <li key={card.href}>
            <Link
              className="block rounded-lg border border-gray-200 bg-white p-4 transition-[transform,background-color] duration-150 ease-out hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:scale-[0.99] dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700/50"
              href={card.href}
            >
              <span className="flex items-baseline justify-between gap-2">
                <span className="font-medium text-gray-900 text-sm dark:text-white">
                  {card.title}
                </span>
                <span className="text-gray-500 text-xs dark:text-gray-400">
                  {card.stat}
                </span>
              </span>
              <span className="mt-1 block text-gray-600 text-sm dark:text-gray-300">
                {card.description}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
