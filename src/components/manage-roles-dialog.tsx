"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCloseOnBack } from "@/hooks/use-close-on-back";
import { DEFAULT_ROLE_NAME, type RoleName } from "@/lib/role-names";
import { cn } from "@/lib/utils";
import type { AdminUser } from "@/types/admin";

const roleOptions: RoleName[] = ["ADMIN", "MODERATOR", "USER"];

function holds(roles: readonly string[], role: RoleName): boolean {
  return roles.some(
    (r) => typeof r === "string" && r.toUpperCase() === role.toUpperCase()
  );
}

export function ManageRolesDialog({
  user,
  open,
  onOpenChangeAction,
  onSaveAction,
}: {
  user: AdminUser;
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  onSaveAction: (userId: string, roleNames: RoleName[]) => Promise<void>;
}) {
  const [selected, setSelected] = useState<RoleName[]>([...user.roles]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useCloseOnBack(open, () => onOpenChangeAction(false));

  const display = user.userName ?? user.name ?? user.email ?? user.id;

  const toggle = (role: RoleName) => {
    setSelected((prev) =>
      holds(prev, role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await onSaveAction(user.id, selected);
      onOpenChangeAction(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update roles.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog onOpenChange={onOpenChangeAction} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage roles</DialogTitle>
          <DialogDescription>
            Toggle roles for {display}. USER is always held and cannot be
            removed.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          {roleOptions.map((role) => {
            const active = holds(selected, role);
            const isOnlyRole = active === true && selected.length === 1;
            const isFloor = role === DEFAULT_ROLE_NAME;
            const locked = isOnlyRole || isFloor || saving;
            return (
              <button
                aria-label={`Toggle ${role}`}
                aria-pressed={active}
                className={cn(
                  "flex cursor-pointer items-center justify-between rounded-md border px-3 py-2 text-sm transition-[transform,background-color,border-color] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:scale-[0.99]",
                  active ? "border-primary/60 bg-primary/10" : "hover:bg-muted",
                  locked ? "cursor-not-allowed opacity-60" : ""
                )}
                disabled={locked}
                key={role}
                onClick={() => toggle(role)}
                title={
                  isFloor
                    ? "USER is always held"
                    : isOnlyRole
                      ? `${role} is the last membership and cannot be removed`
                      : `Toggle ${role}`
                }
                type="button"
              >
                <span className="font-medium">{role}</span>
                <Badge variant={active ? "default" : "outline"}>
                  {active ? "Assigned" : "Not assigned"}
                </Badge>
              </button>
            );
          })}
        </div>
        {error ? (
          <p className="text-red-600 text-sm dark:text-red-400" role="alert">
            {error}
          </p>
        ) : null}

        <DialogFooter>
          <Button
            className="cursor-pointer"
            disabled={saving}
            onClick={() => onOpenChangeAction(false)}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            className="cursor-pointer"
            disabled={saving}
            onClick={handleSave}
          >
            {saving ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
