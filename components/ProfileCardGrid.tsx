"use client";

import { useState } from "react";
import { LearningProgressCard } from "@/components/LearningProgressCard";
import { AchievementsCard } from "@/components/AchievementsCard";
import { DeleteDataCard } from "@/components/DeleteDataCard";
import { InfoCard } from "./InfoCard";

interface ProfileCardGridProps {
  name: string | null;
  email: string | null
}

export function ProfileCardGrid({ name, email }: ProfileCardGridProps) {
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 px-4 py-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <InfoCard name={name} email={email} />
        <LearningProgressCard key={refreshKey} />
        <AchievementsCard />
        <DeleteDataCard onResetAction={handleRefresh} />
      </div>
    </div>
  );
}
