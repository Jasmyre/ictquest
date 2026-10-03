import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function StatSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-5 shadow-sm",
        "motion-safe:animate-pulse",
        className
      )}
    >
      <Skeleton className="h-3.5 w-24" />
      <Skeleton className="mt-3 h-8 w-16" />
      <Skeleton className="mt-2 h-3 w-32" />
    </div>
  );
}

export default function DashboardLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading dashboard"
      className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8"
    >
      <div className="max-w-2xl">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="mt-3 h-9 w-64 sm:w-80" />
        <Skeleton className="mt-2 h-4 w-52" />
      </div>

      <div
        className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
        data-testid="dashboard-skeleton-stats"
      >
        <StatSkeleton />
        <StatSkeleton />
        <StatSkeleton />
        <StatSkeleton />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-6 shadow-sm lg:col-span-2">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="mt-2 h-4 w-56" />
          <Skeleton className="mt-5 h-2.5 w-full" />
          <div className="mt-5 space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
          <Skeleton className="mt-6 h-10 w-36" />
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="mt-2 h-4 w-40" />
          <div className="mt-5 space-y-2.5">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </main>
  );
}
