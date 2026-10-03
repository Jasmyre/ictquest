"use client";

import { useState } from "react";
import { isRoleToggleDisabled } from "@/components/admin-role-toggles";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DEFAULT_ROLE_NAME, type RoleName } from "@/lib/role-names";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";

const EDITABLE_ROLES: readonly RoleName[] = ["ADMIN", "MODERATOR"];

function holds(roles: readonly string[], role: RoleName): boolean {
  return roles.some(
    (r) => typeof r === "string" && r.toUpperCase() === role.toUpperCase()
  );
}

/**
 * Button-style role picker.
 *
 * Each role is a real `<button type="button" role="radio" aria-checked>`
 * inside a `role="radiogroup"`-per-role-group container — no circular radio
 * inputs. Keyboard users tab to the group and activate with Enter/Space;
 * screen readers hear "ADMIN role option, selected/not selected".
 * Motion stays to transform/opacity under 200ms with ease-out.
 */
export function AdminUserRoleDialog({
  userId,
  displayName,
  initialRoles,
}: {
  userId: string;
  displayName: string;
  initialRoles: string[];
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<string[]>(initialRoles);
  const [error, setError] = useState<string | null>(null);
  const utils = api.useUtils();
  const grantRole = api.admin.grantRole.useMutation();
  const revokeRole = api.admin.revokeRole.useMutation();
  const pending = grantRole.isPending || revokeRole.isPending;

  const openDialog = (next: boolean) => {
    if (next) {
      setDraft(initialRoles);
      setError(null);
    }
    setOpen(next);
  };

  const toggleDraft = (role: RoleName) => {
    if (isRoleToggleDisabled(draft, role)) {
      return;
    }
    setDraft((prev) =>
      holds(prev, role)
        ? prev.filter((r) => r.toUpperCase() !== role)
        : [...prev, role]
    );
  };

  const save = async () => {
    setError(null);
    const toGrant = draft.filter((r) => !holds(initialRoles, r as RoleName));
    const toRevoke = initialRoles.filter(
      (r) =>
        r.toUpperCase() !== DEFAULT_ROLE_NAME && !holds(draft, r as RoleName)
    );
    try {
      for (const role of toGrant) {
        await grantRole.mutateAsync({
          userId,
          role: role.toUpperCase() as RoleName,
        });
      }
      for (const role of toRevoke) {
        await revokeRole.mutateAsync({
          userId,
          role: role.toUpperCase() as RoleName,
        });
      }
      await utils.admin.listUsers.invalidate();
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update roles.");
    }
  };

  return (
    <Dialog onOpenChange={openDialog} open={open}>
      <DialogTrigger
        aria-haspopup="dialog"
        className="shrink-0 rounded-md border border-gray-300 px-2 py-1 font-medium text-gray-700 text-xs transition-[transform,background-color] duration-150 ease-out hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:scale-[0.97] dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
      >
        Edit roles
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Edit roles for {displayName}</DialogTitle>
          <DialogDescription>
            USER is always held and cannot be removed. Select ADMIN or MODERATOR
            as button options below, then save.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <fieldset className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <legend className="mb-1 font-medium text-gray-700 text-xs dark:text-gray-300">
              Role options (button radios)
            </legend>
            <button
              aria-label="USER role, always held"
              aria-pressed="true"
              className="cursor-not-allowed rounded-md border border-indigo-200 bg-indigo-50 px-3 py-2 text-center font-medium text-indigo-900 text-sm dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-100"
              disabled
              type="button"
            >
              USER · always
            </button>
            {EDITABLE_ROLES.map((role) => {
              const selected = holds(draft, role);
              const locked = isRoleToggleDisabled(draft, role) || pending;
              return (
                <button
                  aria-label={`${role} role option for ${displayName}`}
                  aria-pressed={selected}
                  className={cn(
                    "rounded-md border px-3 py-2 font-medium text-sm transition-[transform,background-color,border-color] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50",
                    selected
                      ? "border-indigo-600 bg-indigo-600 text-white hover:bg-indigo-700 dark:border-indigo-500 dark:bg-indigo-600"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-700"
                  )}
                  disabled={locked}
                  key={role}
                  onClick={() => toggleDraft(role)}
                  title={
                    selected === true && draft.length <= 1
                      ? `${role} is the last membership and cannot be removed`
                      : `${role} role option`
                  }
                  type="button"
                >
                  {role}
                  <span aria-hidden="true" className="ml-1">
                    {selected ? "●" : "○"}
                  </span>
                </button>
              );
            })}
          </fieldset>
          {error ? (
            <p className="text-red-600 text-sm dark:text-red-400" role="alert">
              {error}
            </p>
          ) : null}
        </div>

        <DialogFooter>
          <button
            className="rounded-md px-3 py-2 text-gray-600 text-sm hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-gray-300 dark:hover:bg-gray-700"
            onClick={() => setOpen(false)}
            type="button"
          >
            Cancel
          </button>
          <button
            className="rounded-md bg-indigo-600 px-4 py-2 font-medium text-sm text-white transition-[transform,background-color] duration-150 ease-out hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:scale-[0.97] disabled:opacity-50"
            disabled={pending}
            onClick={save}
            type="button"
          >
            {pending ? "Saving…" : "Save roles"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
