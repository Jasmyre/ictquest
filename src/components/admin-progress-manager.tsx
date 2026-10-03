"use client";

import { useMemo, useState } from "react";
import { AdminPageHeader } from "@/components/admin-page-header";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/trpc/react";

type SupportUser = {
  id: string;
  email: string | null;
  userName: string | null;
};

export function AdminProgressManager({ users }: { users: SupportUser[] }) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [achievementName, setAchievementName] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [resetTarget, setResetTarget] = useState<SupportUser | null>(null);

  const grant = api.admin.grantAchievement.useMutation();
  const revoke = api.admin.revokeAchievement.useMutation();
  const reset = api.admin.resetProgress.useMutation();
  const busy = grant.isPending || revoke.isPending || reset.isPending;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return users;
    }
    return users.filter((u) =>
      [u.userName ?? "", u.email ?? "", u.id]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [query, users]);

  const selected = users.find((u) => u.id === selectedId) ?? null;

  const runGrant = async (mode: "grant" | "revoke") => {
    if (!selected || achievementName.trim().length === 0) {
      return;
    }
    setMessage(null);
    try {
      if (mode === "grant") {
        await grant.mutateAsync({
          userId: selected.id,
          achievementName: achievementName.trim(),
        });
        setMessage(`Granted “${achievementName.trim()}” to ${selected.id}.`);
      } else {
        await revoke.mutateAsync({
          userId: selected.id,
          achievementName: achievementName.trim(),
        });
        setMessage(`Revoked “${achievementName.trim()}” from ${selected.id}.`);
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Operation failed.");
    }
  };

  return (
    <div className="w-full min-w-0 flex-1 space-y-4 p-4 lg:px-8">
      <AdminPageHeader
        description="Grant or revoke achievements and reset progress for support cases. Pick a user, then act."
        title="Progress Operations"
      />
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0 space-y-3">
          <div className="max-w-md">
            <Label htmlFor="admin-progress-search">Search users</Label>
            <Input
              id="admin-progress-search"
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, email, or id…"
              type="search"
              value={query}
            />
          </div>
          <ul
            aria-label="Support users"
            className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white dark:divide-gray-700 dark:border-gray-700 dark:bg-gray-800"
          >
            {filtered.map((user) => {
              const display = user.userName ?? user.email ?? user.id;
              const active = user.id === selectedId;
              return (
                <li data-testid="admin-progress-user-row" key={user.id}>
                  <button
                    aria-pressed={active}
                    className={`flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-inset ${active ? "bg-indigo-50 dark:bg-indigo-950" : "hover:bg-gray-50 dark:hover:bg-gray-700/50"}`}
                    onClick={() => {
                      setSelectedId(user.id);
                      setMessage(null);
                    }}
                    type="button"
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-gray-900 text-sm dark:text-white">
                        {display}
                      </span>
                      <span className="block truncate text-gray-500 text-xs dark:text-gray-400">
                        {user.id}
                      </span>
                    </span>
                    <span
                      className={`shrink-0 rounded-md border px-2 py-1 font-medium text-xs ${active ? "border-indigo-600 bg-indigo-600 text-white" : "border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-300"}`}
                    >
                      {active ? "Selected" : "Select"}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <section
          aria-label="Support actions"
          className="h-fit rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
        >
          <h2 className="font-medium text-gray-900 text-sm dark:text-white">
            {selected
              ? `Support: ${selected.userName ?? selected.email ?? selected.id}`
              : "Select a user"}
          </h2>
          {selected ? (
            <div className="mt-3 space-y-3">
              <div className="space-y-1">
                <Label htmlFor="admin-achievement-name">Achievement name</Label>
                <Input
                  id="admin-achievement-name"
                  onChange={(e) => setAchievementName(e.target.value)}
                  placeholder="e.g. first-lesson-complete"
                  value={achievementName}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  className="rounded-md bg-indigo-600 px-3 py-2 font-medium text-sm text-white transition-[transform,background-color] duration-150 ease-out hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:scale-[0.97] disabled:opacity-50"
                  disabled={busy || achievementName.trim().length === 0}
                  onClick={() => runGrant("grant")}
                  type="button"
                >
                  Grant achievement
                </button>
                <button
                  className="rounded-md border border-gray-300 px-3 py-2 font-medium text-gray-700 text-sm hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:scale-[0.97] disabled:opacity-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                  disabled={busy || achievementName.trim().length === 0}
                  onClick={() => runGrant("revoke")}
                  type="button"
                >
                  Revoke achievement
                </button>
              </div>
              <div className="border-gray-200 border-t pt-3 dark:border-gray-700">
                <button
                  className="rounded-md border border-red-300 px-3 py-2 font-medium text-red-700 text-sm hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 active:scale-[0.97] dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950"
                  onClick={() => setResetTarget(selected)}
                  type="button"
                >
                  Reset all progress…
                </button>
              </div>
              {message ? (
                <output
                  aria-live="polite"
                  className="block text-gray-700 text-sm dark:text-gray-200"
                >
                  {message}
                </output>
              ) : null}
            </div>
          ) : (
            <p className="mt-1 text-gray-600 text-sm dark:text-gray-300">
              Choose a user on the left to grant, revoke, or reset progress.
            </p>
          )}
        </section>
      </div>

      <Dialog
        onOpenChange={(open) => {
          if (!open) {
            setResetTarget(null);
          }
        }}
        open={resetTarget !== null}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset progress?</DialogTitle>
            <DialogDescription>
              This deletes all progress rows for {resetTarget?.id}. Achievements
              stay unless revoked separately. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              className="rounded-md px-3 py-2 text-gray-600 text-sm hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              onClick={() => setResetTarget(null)}
              type="button"
            >
              Cancel
            </button>
            <button
              className="rounded-md bg-red-600 px-4 py-2 font-medium text-sm text-white hover:bg-red-700 disabled:opacity-50"
              disabled={reset.isPending}
              onClick={async () => {
                if (!resetTarget) {
                  return;
                }
                try {
                  await reset.mutateAsync({ userId: resetTarget.id });
                  setMessage(`Reset progress for ${resetTarget.id}.`);
                } catch (err) {
                  setMessage(
                    err instanceof Error ? err.message : "Reset failed."
                  );
                }
                setResetTarget(null);
              }}
              type="button"
            >
              {reset.isPending ? "Resetting…" : "Reset progress"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
