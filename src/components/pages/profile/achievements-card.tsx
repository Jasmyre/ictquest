import { Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toastDescription } from "@/lib/utils";
import type { api } from "@/trpc/server";

export const AchievementsCard = ({
  getUserAchievements,
}: {
  getUserAchievements: Awaited<ReturnType<typeof api.user.getUserAchievements>>;
}) => {
  const achievements = getUserAchievements.data;

  if (!getUserAchievements.success) {
    return (
      <Card className="border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center font-semibold text-2xl text-gray-900 dark:text-gray-100">
            <Award className="mr-2 h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          Unable to load your achievements right now. Please try again later.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center font-semibold text-2xl text-gray-900 dark:text-gray-100">
          <Award className="mr-2 h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {achievements.length ? (
            achievements?.map((achievement) => (
              <li className="flex py-4" key={achievement.achievementName}>
                <Award className="mr-2 h-6 w-6 text-yellow-400" />
                <span className="font-medium text-gray-900 text-sm dark:text-gray-100">
                  {String(
                    toastDescription(
                      achievement.achievementName,
                      achievement.achievementDescription
                    )
                  )}
                </span>
              </li>
            ))
          ) : (
            <p className="text-muted-foreground">
              You have not unlocked any achievements yet.
            </p>
          )}
        </ul>
      </CardContent>
    </Card>
  );
};
