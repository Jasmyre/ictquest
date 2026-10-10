import { Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toastDescription } from "@/lib/utils";
import type { api } from "@/trpc/server";

export const AchievementsCard = ({
  getUserAchievements,
}: {
  getUserAchievements: Awaited<ReturnType<typeof api.achievement.list>>;
}) => {
  const achievements = getUserAchievements.data;

  if (!getUserAchievements.success) {
    return (
      <Card data-testid="achievement-inventory">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Award className="h-5 w-5 text-primary" />
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
    <Card data-testid="achievement-inventory">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Award className="h-5 w-5 text-primary" />
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="divide-y divide-border">
          {achievements.length ? (
            achievements?.map((achievement) => (
              <li
                className="flex items-center gap-3 py-3"
                data-testid="achievement-item"
                key={achievement.achievementName}
              >
                <Award className="h-5 w-5 shrink-0 text-primary" />
                <span className="font-medium text-sm">
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
