import { Book, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { api } from "@/trpc/server";

type UserStatSummaryProps = {
  user: Pick<
    Awaited<ReturnType<typeof api.user.getUserStatsById>>["data"],
    "totalSubtopicsCompleted" | "totalAchievements"
  >;
};

const UserStatSummary = ({ user }: UserStatSummaryProps) => (
  <section className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
    {[
      {
        icon: Book,
        label: "Lessons Completed",
        value: user.totalSubtopicsCompleted,
      },
      {
        icon: Trophy,
        label: "Achievements",
        value: user?.totalAchievements,
      },
    ].map((stat, index) => (
      <Card
        className="border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
        key={index}
      >
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-indigo-100 p-2 dark:bg-indigo-900/20">
              <stat.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-gray-600 text-sm dark:text-gray-400">
                {stat.label}
              </p>
              <p className="font-bold text-2xl text-gray-900 dark:text-white">
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
