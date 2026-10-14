import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingSettings() {
  return (
    <output
      aria-busy="true"
      aria-label="Loading settings"
      className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8"
    >
      <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-4 sm:gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="sm:hidden">
          <Skeleton className="h-[68px] w-full rounded-xl" />
        </div>
        <Card aria-hidden="true" className="hidden sm:block">
          <CardContent className="flex flex-col gap-2 pt-6">
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-px w-full" />
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-px w-full" />
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-px w-full" />
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-px w-full" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </CardContent>
        </Card>
        <Card aria-hidden="true">
          <CardHeader className="flex flex-col gap-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-9 w-32" />
          </CardContent>
        </Card>
      </div>
    </output>
  );
}
