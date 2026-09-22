"use client";

import { useState } from "react";
import { api } from "@/trpc/react";

export function AdminSuspendToggle({
  userId,
  initialSuspendedAt,
}: {
  userId: string;
  initialSuspendedAt: string | null;
}) {
  const [suspendedAt, setSuspendedAt] = useState<string | null>(
    initialSuspendedAt
  );
  const [pending, setPending] = useState(false);
  const utils = api.useUtils();
  const suspendUser = api.admin.suspendUser.useMutation();
  const unsuspendUser = api.admin.unsuspendUser.useMutation();

  const suspended = suspendedAt !== null;

  const toggle = async () => {
    if (pending) {
      return;
    }
    const previous = suspendedAt;
    setPending(true);
    // Optimistic flip with revert: suspension never touches roles, so the
    // only visible change is this toggle until the list invalidates.
    setSuspendedAt(suspended ? null : new Date().toISOString());
    try {
      if (suspended) {
        await unsuspendUser.mutateAsync({ userId });
      } else {
        await suspendUser.mutateAsync({ userId });
      }
      await utils.admin.listUsers.invalidate();
    } catch {
      setSuspendedAt(previous);
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      aria-label={`${suspended ? "Unsuspend" : "Suspend"} user ${userId}`}
      aria-pressed={suspended}
      className="shrink-0 rounded-md border border-gray-300 px-2 py-1 text-gray-600 text-xs hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
      disabled={pending}
      onClick={toggle}
      type="button"
    >
      {suspended ? "Unsuspend" : "Suspend"}
    </button>
  );
}
