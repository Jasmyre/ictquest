"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toastDescription } from "@/lib/utils";
import type { UserAchievement } from "@prisma/client";
import { Award } from "lucide-react";
import { useEffect, useState } from "react";

type AchievementProps = UserAchievement[];

export function AchievementsCard() {
  const [achievements, setAchievements] = useState<AchievementProps>([]);

  useEffect(() => {
    (async () => {
      const response = await fetch("/api/user-achievements");
      const data: AchievementProps = await response.json();
      setAchievements(data);
    })();
  }, []);

  console.log(achievements);
  return (
    <Card className="border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-semibold text-gray-900 dark:text-gray-100">
          <Award className="mr-2 h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {achievements.map((achievement) => {
            return (
              <li className="flex py-4" key={achievement.achievementName}>
                <Award className="mr-2 h-6 w-6 text-yellow-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {String(
                    toastDescription(
                      achievement.achievementName,
                      achievement.achievementDescription,
                    ),
                  )}
                </span>
              </li>
            );
          })}

          {/* <li className="flex py-4">
            <Award className="mr-2 h-6 w-6 text-gray-400" />
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Form Builder
            </span>
          </li>
          <li className="flex py-4">
            <Award className="mr-2 h-6 w-6 text-yellow-600" />
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              HTML5 Pioneer
            </span>
          </li> */}
        </ul>
      </CardContent>
    </Card>
  );
}
