"use client";

import { useMemo, useState } from "react";
import {
  AdminEmptyState,
  AdminPageHeader,
} from "@/components/admin-page-header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/trpc/react";

export type AchievementRow = {
  id: number;
  name: string;
  description: string | null;
};

function AchievementForm({
  initialName = "",
  initialDescription = "",
  pending,
  error,
  submitLabel,
  onSubmit,
}: {
  initialName?: string;
  initialDescription?: string;
  pending: boolean;
  error: string | null;
  submitLabel: string;
  onSubmit: (input: { name: string; description: string }) => void;
}) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ name: name.trim(), description: description.trim() });
      }}
    >
      <div className="space-y-1">
        <Label htmlFor={`ach-name-${submitLabel}`}>Name</Label>
        <Input
          id={`ach-name-${submitLabel}`}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. first-lesson-complete"
          required
          value={name}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor={`ach-desc-${submitLabel}`}>Description</Label>
        <Input
          id={`ach-desc-${submitLabel}`}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What did the learner achieve?"
          value={description}
        />
      </div>
      {error ? (
        <p className="text-red-600 text-sm dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}
      <DialogFooter>
        <Button disabled={pending || name.trim().length === 0} type="submit">
          {/* biome-ignore lint/nursery/noLeakedRender: both branches are plain strings */}
          {pending ? "Saving…" : submitLabel}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function AdminAchievementsManager({
  initial,
}: {
  initial: AchievementRow[];
}) {
  const [query, setQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<AchievementRow | null>(null);
  const [deleting, setDeleting] = useState<AchievementRow | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const utils = api.useUtils();
  const createDef = api.admin.createAchievementDefinition.useMutation();
  const updateDef = api.admin.updateAchievementDefinition.useMutation();
  const deleteDef = api.admin.deleteAchievementDefinition.useMutation();

  const { data } = api.admin.listAchievementDefinitions.useQuery(
    {},
    { initialData: { success: true as const, data: initial } }
  );
  const rows = useMemo(
    () => (data?.success ? data.data : initial),
    [data, initial]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return rows;
    }
    return rows.filter((r) =>
      `${r.name} ${r.description ?? ""}`.toLowerCase().includes(q)
    );
  }, [query, rows]);

  const refresh = async () => {
    await utils.admin.listAchievementDefinitions.invalidate();
  };

  return (
    <div className="w-full min-w-0 flex-1 space-y-4 p-4 lg:px-8">
      <AdminPageHeader
        actions={
          <Dialog onOpenChange={setCreateOpen} open={createOpen}>
            <DialogTrigger className="rounded-md bg-indigo-600 px-4 py-2 font-medium text-sm text-white transition-[transform,background-color] duration-150 ease-out hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:scale-[0.97]">
              New achievement
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create achievement</DialogTitle>
                <DialogDescription>
                  Introduce a new learner goal. Names must be unique.
                </DialogDescription>
              </DialogHeader>
              <AchievementForm
                error={formError}
                onSubmit={async ({ name, description }) => {
                  setFormError(null);
                  try {
                    await createDef.mutateAsync({
                      name,
                      description: description || undefined,
                    });
                    await refresh();
                    setCreateOpen(false);
                  } catch (err) {
                    setFormError(
                      err instanceof Error ? err.message : "Unable to create."
                    );
                  }
                }}
                pending={createDef.isPending}
                submitLabel="Create achievement"
              />
            </DialogContent>
          </Dialog>
        }
        description="Create, rename, clarify, or remove learner goals. Changes apply immediately to progress operations."
        title="Achievement Definitions"
      />
      <div className="max-w-md">
        <Label htmlFor="admin-achievement-search">Search achievements</Label>
        <Input
          id="admin-achievement-search"
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or description…"
          type="search"
          value={query}
        />
      </div>
      {filtered.length === 0 ? (
        <AdminEmptyState
          description="Try a different search, or create a new learner goal."
          title="No achievement definitions found"
        />
      ) : (
        <ul
          aria-label="Achievement definitions"
          className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white dark:divide-gray-700 dark:border-gray-700 dark:bg-gray-800"
        >
          {filtered.map((definition) => (
            <li
              className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3"
              data-testid="admin-achievement-row"
              key={definition.id}
            >
              <div className="min-w-0 flex-1 basis-48">
                <p className="truncate font-medium text-gray-900 text-sm dark:text-white">
                  {definition.name}
                </p>
                <p className="truncate text-gray-500 text-xs dark:text-gray-400">
                  {definition.description ?? "No description"}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  aria-label={`Edit ${definition.name}`}
                  className="rounded-md border border-gray-300 px-2 py-1 font-medium text-gray-700 text-xs transition-[transform,background-color] duration-150 ease-out hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:scale-[0.97] dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                  onClick={() => {
                    setFormError(null);
                    setEditing(definition);
                  }}
                  type="button"
                >
                  Edit
                </button>
                <button
                  aria-label={`Delete ${definition.name}`}
                  className="rounded-md border border-red-300 px-2 py-1 font-medium text-red-700 text-xs transition-[transform,background-color] duration-150 ease-out hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 active:scale-[0.97] dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950"
                  onClick={() => setDeleting(definition)}
                  type="button"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Dialog
        onOpenChange={(open) => {
          if (!open) {
            setEditing(null);
          }
        }}
        open={editing !== null}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {editing?.name}</DialogTitle>
            <DialogDescription>
              Rename or clarify this goal. Saving updates it everywhere.
            </DialogDescription>
          </DialogHeader>
          {editing ? (
            <AchievementForm
              error={formError}
              initialDescription={editing.description ?? ""}
              initialName={editing.name}
              key={editing.id}
              onSubmit={async ({ name, description }) => {
                setFormError(null);
                try {
                  await updateDef.mutateAsync({
                    id: editing.id,
                    name,
                    description: description || null,
                  });
                  await refresh();
                  setEditing(null);
                } catch (err) {
                  setFormError(
                    err instanceof Error ? err.message : "Unable to update."
                  );
                }
              }}
              pending={updateDef.isPending}
              submitLabel="Save changes"
            />
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog
        onOpenChange={(open) => {
          if (!open) {
            setDeleting(null);
          }
        }}
        open={deleting !== null}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {deleting?.name}?</DialogTitle>
            <DialogDescription>
              This removes the definition. Granted copies stay on learner
              records until revoked. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              className="rounded-md px-3 py-2 text-gray-600 text-sm hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              onClick={() => setDeleting(null)}
              type="button"
            >
              Cancel
            </button>
            <button
              className="rounded-md bg-red-600 px-4 py-2 font-medium text-sm text-white hover:bg-red-700 active:scale-[0.97] disabled:opacity-50"
              disabled={deleteDef.isPending}
              onClick={async () => {
                if (!deleting) {
                  return;
                }
                await deleteDef.mutateAsync({ id: deleting.id });
                await refresh();
                setDeleting(null);
              }}
              type="button"
            >
              {deleteDef.isPending ? "Deleting…" : "Delete"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
