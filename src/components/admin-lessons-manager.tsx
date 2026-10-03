"use client";

import { useMemo, useState } from "react";
import { AdminPageHeader } from "@/components/admin-page-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type LessonEntry = {
  lesson: string;
  subtopic: string;
  title: string;
  order: number;
  file: string;
};

export function AdminLessonsManager({ entries }: { entries: LessonEntry[] }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return entries;
    }
    return entries.filter((e) =>
      `${e.title} ${e.lesson} ${e.subtopic} ${e.file}`.toLowerCase().includes(q)
    );
  }, [query, entries]);

  return (
    <div className="w-full min-w-0 flex-1 space-y-4 p-4 lg:px-8">
      <AdminPageHeader
        description="Curriculum stays dev-authored MDX in git. This listing reads the MDX-backed store — runtime lesson editing is intentionally unavailable here."
        title="Lesson Content"
      />
      <div className="max-w-md">
        <Label htmlFor="admin-lesson-search">Search lessons</Label>
        <Input
          id="admin-lesson-search"
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, lesson, or file…"
          type="search"
          value={query}
        />
      </div>
      <p
        aria-live="polite"
        className="text-gray-600 text-xs dark:text-gray-400"
      >
        Showing {filtered.length} of {entries.length} entries
      </p>
      {filtered.length === 0 ? (
        <output className="block rounded-lg border border-gray-300 border-dashed bg-white px-6 py-10 text-center dark:border-gray-700 dark:bg-gray-800">
          <p className="font-medium text-gray-900 text-sm dark:text-white">
            No lessons match
          </p>
          <p className="text-gray-600 text-sm dark:text-gray-300">
            Try a different search.
          </p>
        </output>
      ) : (
        <ul
          aria-label="Lesson content"
          className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white dark:divide-gray-700 dark:border-gray-700 dark:bg-gray-800"
        >
          {filtered.map((entry) => (
            <li
              className="flex items-center justify-between gap-4 px-4 py-3"
              data-testid="admin-lesson-row"
              key={`${entry.lesson}/${entry.subtopic}`}
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-gray-900 text-sm dark:text-white">
                  {entry.title}
                </p>
                <p className="truncate text-gray-500 text-xs dark:text-gray-400">
                  {entry.lesson} / {entry.subtopic} · order {entry.order} ·{" "}
                  {entry.file}
                </p>
              </div>
              <span className="shrink-0 rounded-md bg-gray-100 px-2 py-1 text-gray-600 text-xs dark:bg-gray-700 dark:text-gray-300">
                MDX
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
