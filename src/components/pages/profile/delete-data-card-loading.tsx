"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const DeleteDataCardLoading = () => (
  <Card aria-busy="true" aria-label="Loading session settings">
    <CardHeader>
      <Skeleton className="h-5 w-36" />
      <Skeleton className="mt-2 h-4 w-56" />
    </CardHeader>
    <CardContent className="flex flex-col gap-2">
      <Skeleton className="h-9 w-full" />
      <Skeleton className="h-9 w-full" />
    </CardContent>
  </Card>
);
