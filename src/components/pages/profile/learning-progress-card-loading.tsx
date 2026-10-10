import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const LearningProgressCardLoading = () => (
  <Card aria-busy="true" aria-label="Loading learning progress">
    <CardHeader>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-5 w-36" />
        </div>
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
            <div className="mb-1 flex justify-between">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-3.5 w-10" />
            </div>
            <Skeleton className="h-2.5 w-full" />
          </div>
        ))}
        <Skeleton className="mt-4 h-9 w-28" />
      </div>
    </CardContent>
  </Card>
);
