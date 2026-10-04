"use client";

import {
  Ban,
  Flag,
  MoreVertical,
  Search,
  Sparkles,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import type { GetUsersStats } from "@/data/user";

const WHITESPACE_PATTERN = /\s+/;

function initials(name: string | null): string {
  if (!name) {
    return "?";
  }
  return name
    .trim()
    .split(WHITESPACE_PATTERN)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function SocialList({ users }: { users: GetUsersStats[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return users;
    }
    return users.filter(
      (user) =>
        user.username?.toLowerCase().includes(q) ||
        user.id.toLowerCase().includes(q)
    );
  }, [users, query]);

  return (
    <div>
      <div className="mb-3 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <p className="text-muted-foreground text-sm">
          {filtered.length} {filtered.length === 1 ? "learner" : "learners"}
          {query ? ` matching “${query.trim()}”` : " in the community"}
        </p>
        <div className="relative w-full sm:w-72">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-gray-400" />
          <Input
            aria-label="Search learners"
            className="w-full pl-9"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name…"
            type="search"
            value={query}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed px-6 py-16 text-center">
          <p className="font-medium text-gray-900 dark:text-white">
            No learners found
          </p>
          <p className="mt-1 text-gray-600 text-sm dark:text-gray-400">
            Try a different name.
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {filtered.map((user) => (
            <li key={user.id}>
              <Card className="hover:-translate-y-0.5 h-full transition-[border-color,box-shadow,transform] duration-200 ease-out hover:shadow-md">
                <CardContent className="flex h-full flex-col gap-2 p-3 sm:gap-4 sm:p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar className="h-11 w-11 shrink-0">
                        <AvatarImage
                          alt={user.username ?? "Learner"}
                          src={user.avatar ?? undefined}
                        />
                        <AvatarFallback>
                          {initials(user.username)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <h2 className="truncate font-semibold text-base leading-tight">
                          {user.username ?? "Unnamed learner"}
                        </h2>
                        <p className="mt-0.5 truncate text-muted-foreground text-xs">
                          {user.level}
                        </p>
                      </div>
                    </div>
                    {/* TODO: wire report/block actions */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-label={`More actions for ${user.username ?? "learner"}`}
                          className="h-8 w-8 shrink-0 cursor-pointer p-0"
                          variant="ghost"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="cursor-pointer" disabled>
                          <Flag className="mr-2 h-4 w-4" />
                          Report user
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" disabled>
                          <Ban className="mr-2 h-4 w-4" />
                          Block user
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex items-center gap-4 text-muted-foreground text-sm">
                    <span className="inline-flex items-center gap-1.5">
                      <Trophy aria-hidden className="h-4 w-4" />
                      {user.numberOfAchievements}{" "}
                      {user.numberOfAchievements === 1 ? "badge" : "badges"}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Sparkles aria-hidden className="h-4 w-4" />
                      {user.numberOfSubtopics}{" "}
                      {user.numberOfSubtopics === 1 ? "lesson" : "lessons"}
                    </span>
                  </div>

                  <div className="mt-auto flex items-center gap-2 pt-1">
                    {/* TODO: wire follow mutation */}
                    <Button
                      className="flex-1 cursor-pointer transition-transform duration-150 ease-out active:scale-[0.97]"
                      disabled
                      title="Follow coming soon"
                    >
                      Follow
                    </Button>
                    <Button
                      asChild
                      className="flex-1 cursor-pointer transition-transform duration-150 ease-out active:scale-[0.97]"
                      variant="outline"
                    >
                      <Link
                        className="cursor-pointer"
                        href={`/user/${user.id}`}
                      >
                        View profile
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
