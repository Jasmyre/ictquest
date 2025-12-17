"use client";

import { type JSX, Suspense, useState } from "react";
import { DeleteDataCard } from "@/components/delete-data-card";

export function ProfileCardGrid(): JSX.Element {
  const [_refreshKey, setRefreshKey] = useState<number>(1);

  const handleRefresh = (): void => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Suspense>
          <DeleteDataCard onResetAction={handleRefresh} />
        </Suspense>
      </div>
    </div>
  );
}
