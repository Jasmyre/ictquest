import { Book, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { DashboardData } from "@/server/schemas/dashboard";

type UserStatSummaryProps = {
  user: Pick<DashboardData, "totalSubtopicsCompleted" | "totalAchievements">;
};

const UserStatSummary = ({ user }: UserStatSummaryProps) => (
  <section
    className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4"
    data-testid="user-stat-summary"
  >
    {[
      {
        icon: Book,
        label: "Lessons Completed",
        value: user.totalSubtopicsCompleted,
      },
      {
        icon: Trophy,
        label: "Achievements",
        value: user.totalAchievements,
      },
    ].map((stat) => (
      <Card key={stat.label}>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-muted p-2">
              <stat.icon aria-hidden="true" className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">{stat.label}</p>
              <p className="font-bold text-2xl text-foreground tabular-nums">
                {stat.value}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </section>
);

export default UserStatSummary;
