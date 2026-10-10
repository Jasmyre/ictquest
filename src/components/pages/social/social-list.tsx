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
import {
  DropDrawer,
  DropDrawerContent,
  DropDrawerItem,
  DropDrawerTrigger,
} from "@/components/dropdrawer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="min-w-0 max-w-2xl text-muted-foreground text-sm">
          {filtered.length} {filtered.length === 1 ? "learner" : "learners"}
          {query ? ` matching “${query.trim()}”` : " in the community"}
        </p>
        <div className="relative w-full sm:w-72">
          <Search
            aria-hidden="true"
            className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground"
          />
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
        <div className="mt-6 rounded-xl border border-dashed px-6 py-16 text-center">
          <p className="font-medium text-foreground">No learners found</p>
          <p className="mt-1 text-muted-foreground text-sm">
            Try a different name.
          </p>
        </div>
      ) : (
        <ul className="stagger-enter mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {filtered.map((user) => (
            <li className="h-full" key={user.id}>
              <Card className="motion-safe:hover:-translate-y-0.5 flex h-full flex-col transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-safe:hover:shadow-md">
                <CardContent className="flex flex-1 flex-col pt-6">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar className="h-11 w-11 shrink-0">
                        <AvatarImage
                          alt={user.username ?? "Learner"}
                          src={user.avatar ?? undefined}
                        />
                        <AvatarFallback aria-hidden="true">
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
                    <DropDrawer>
                      <DropDrawerTrigger asChild>
                        <Button
                          aria-label={`More actions for ${user.username ?? "learner"}`}
                          className="h-8 w-8 shrink-0 cursor-pointer p-0 transition-transform duration-150 ease-out active:scale-[0.97]"
                          variant="ghost"
                        >
                          <MoreVertical
                            aria-hidden="true"
                            className="h-4 w-4"
                          />
                        </Button>
                      </DropDrawerTrigger>
                      <DropDrawerContent align="end">
                        <DropDrawerItem disabled>
                          <Flag aria-hidden="true" className="h-4 w-4" />
                          Report user
                        </DropDrawerItem>
                        <DropDrawerItem disabled>
                          <Ban aria-hidden="true" className="h-4 w-4" />
                          Block user
                        </DropDrawerItem>
                      </DropDrawerContent>
                    </DropDrawer>
                  </div>

                  <div className="mt-4 flex items-center gap-4 text-muted-foreground text-sm">
                    <span className="inline-flex items-center gap-1.5 tabular-nums">
                      <Trophy aria-hidden="true" className="h-4 w-4" />
                      {user.numberOfAchievements}{" "}
                      {user.numberOfAchievements === 1 ? "badge" : "badges"}
                    </span>
                    <span className="inline-flex items-center gap-1.5 tabular-nums">
                      <Sparkles aria-hidden="true" className="h-4 w-4" />
                      {user.numberOfSubtopics}{" "}
                      {user.numberOfSubtopics === 1 ? "lesson" : "lessons"}
                    </span>
                  </div>

                  <div className="mt-auto flex items-center gap-2 pt-6">
                    <Button
                      aria-disabled="true"
                      className="flex-1 cursor-pointer transition-transform duration-150 ease-out active:scale-[0.97]"
                      onClick={(event) => event.preventDefault()}
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
