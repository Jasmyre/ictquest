import { PageHeaderSkeleton } from "@/components/page-header-skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function PageSkeleton() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading lesson"
      className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8"
    >
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="w-full min-w-0 max-w-2xl">
          <PageHeaderSkeleton />
        </div>
        <div className="w-full shrink-0 sm:w-48">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="mt-2 h-1.5 w-full" />
        </div>
      </header>
      <section aria-label="Loading subtopics" className="mt-6">
        <Card>
          <CardContent className="p-2 sm:p-3">
            <div className="m-2 mb-3 rounded-lg border bg-muted/40 p-4 sm:m-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="mt-2 h-3 w-32" />
                </div>
                <Skeleton className="h-9 w-full sm:w-32" />
              </div>
            </div>
            <ol className="divide-y divide-border">
              {Array.from({ length: 5 }).map((_, index) => (
                <li
                  className="flex items-center gap-3 rounded-lg p-3 sm:p-4"
                  key={index}
                >
                  <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
                  <span className="min-w-0 flex-1">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="mt-2 h-3 w-1/3" />
                  </span>
                  <Skeleton className="h-4 w-4 shrink-0 rounded-full" />
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
        <Skeleton className="mt-4 h-9 w-28" />
      </section>
    </main>
  );
}
