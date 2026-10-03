import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function AdminPageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0 max-w-2xl">
        <h1 className="font-bold text-2xl text-gray-900 tracking-tight dark:text-white">
          {title}
        </h1>
        <p className="mt-1 text-gray-600 text-sm leading-relaxed dark:text-gray-300">
          {description}
        </p>
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {actions}
        </div>
      ) : null}
    </div>
  );
}

export function AdminEmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <output className="block rounded-lg border border-gray-300 border-dashed bg-white px-6 py-10 text-center dark:border-gray-700 dark:bg-gray-800">
      <p className="font-medium text-gray-900 text-sm dark:text-white">
        {title}
      </p>
      <p className="mx-auto mt-1 max-w-md text-gray-600 text-sm dark:text-gray-300">
        {description}
      </p>
    </output>
  );
}

export function AdminCardShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800",
        className
      )}
    >
      {children}
    </div>
  );
}
