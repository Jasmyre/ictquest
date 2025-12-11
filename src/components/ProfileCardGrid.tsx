"use client";

import type { Prisma } from "@prisma/client";
import { type JSX, Suspense, useState } from "react";
import { AchievementsCard } from "@/components/AchievementsCard";
import { DeleteDataCard } from "@/components/DeleteDataCard";
import { LearningProgressCard } from "@/components/LearningProgressCard";
import { InfoCard } from "./InfoCard";

interface ProfileCardGridProps {
  name?: string | null;
  email?: string | null;
  user: Prisma.UserCreateInput;
}

export function ProfileCardGrid({ user }: ProfileCardGridProps): JSX.Element {
  const [refreshKey, setRefreshKey] = useState<number>(1);

  const handleRefresh = (): void => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Suspense>
          <InfoCard user={user} />
        </Suspense>

        <Suspense>
          <LearningProgressCard key={refreshKey} />
        </Suspense>

        <Suspense>
          <AchievementsCard key={refreshKey + refreshKey} />
        </Suspense>

        <Suspense>
          <DeleteDataCard onResetAction={handleRefresh} />
        </Suspense>
      </div>
    </div>
  );
}
