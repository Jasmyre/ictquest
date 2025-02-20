"use client";

import { useState } from "react";
import { LearningProgressCard } from "@/components/LearningProgressCard";
import { AchievementsCard } from "@/components/AchievementsCard";
import { DeleteDataCard } from "@/components/DeleteDataCard";
import { InfoCard } from "./InfoCard";
import { Prisma } from "@prisma/client";

interface ProfileCardGridProps {
  name?: string | null;
  email?: string | null
  user: Prisma.UserCreateInput
}

export function ProfileCardGrid({user}: ProfileCardGridProps) {
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 px-4 py-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <InfoCard user={user} />
        <LearningProgressCard key={refreshKey} />
        <AchievementsCard />
        <DeleteDataCard onResetAction={handleRefresh} />
      </div>
    </div>
  );
}
