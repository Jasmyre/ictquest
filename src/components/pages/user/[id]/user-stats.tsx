import { Award, Book, GraduationCap, Sparkles, Trophy } from "lucide-react";
import type { UserData } from "@/app/user/[id]/page";
import { CustomProgress } from "@/components/custom-progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import lessons from "@/db/lessons";
import type { api } from "@/trpc/server";

type UserStatsProps = {
  user: Awaited<ReturnType<typeof api.user.getUserStatsById>>["data"];
  userData: UserData;
};

const UserStats = ({ user, userData }: UserStatsProps) => (
  <Tabs className="w-full" defaultValue="progress">
    <TabsList className="mx-auto w-full max-w-md border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
      <TabsTrigger
        className="flex-1 cursor-pointer data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
        value="progress"
      >
        Progress
      </TabsTrigger>
      <TabsTrigger
        className="flex-1 cursor-pointer data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
        value="achievements"
      >
        Achievements
      </TabsTrigger>
      <TabsTrigger
        className="flex-1 cursor-pointer data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
        value="activity"
      >
        Activity
      </TabsTrigger>
    </TabsList>

    <TabsContent className="mt-6" value="progress">
      <Card className="border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <GraduationCap className="h-5 w-5" />
            Learning Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="mb-2 flex justify-between">
              <span className="font-medium text-gray-900 text-sm dark:text-white">
                Overall HTML Mastery
              </span>
              <span className="text-gray-600 text-sm dark:text-gray-400">
                {user.totalProgress}%
              </span>
            </div>
            <CustomProgress
              finalValue={user?.totalProgress ?? 0}
              initialValue={0}
            />
          </div>

          {lessons.map((lesson) => {
            const progress = user.progressData.find(
              (item) => item.topic === lesson.slug
            );

            const completedSubtopics = progress?.subtopics?.length ?? 0;
            const totalSubtopics = lesson.topics.length;

            const percentage =
              totalSubtopics === 0
                ? 0
                : Math.round((completedSubtopics / totalSubtopics) * 100);

            return (
              <div key={lesson.slug}>
                <div className="mb-2 flex justify-between">
                  <span className="font-medium text-gray-900 text-sm dark:text-white">
                    {lesson.title}
                  </span>
                  <span className="text-gray-600 text-sm dark:text-gray-400">
                    {percentage}%
                  </span>
                </div>
                <CustomProgress finalValue={percentage} initialValue={0} />
              </div>
            );
          })}
        </CardContent>
      </Card>
    </TabsContent>

    <TabsContent className="mt-6" value="achievements">
      <Card className="border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Trophy className="h-5 w-5" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {userData.achievements.map((achievement) => (
              <Card
                className="border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
                key={achievement.name}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-indigo-100 p-2 dark:bg-indigo-900/20">
                      <achievement.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {achievement.name}
                      </p>
                      <p className="text-gray-600 text-sm dark:text-gray-400">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </TabsContent>

    <TabsContent className="mt-6" value="activity">
      <Card className="border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Award className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userData.recentActivity.map((activity, index) => (
              <div className="flex items-center gap-4" key={index}>
                <div className="rounded-lg bg-indigo-100 p-2 dark:bg-indigo-900/20">
                  {activity.type === "completed" && (
                    <Book className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  )}
                  {activity.type === "achieved" && (
                    <Trophy className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  )}
                  {activity.type === "started" && (
                    <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  )}
                </div>
                <div>
                  <p className="text-gray-900 text-sm dark:text-white">
                    {activity.type === "completed" &&
                      `Completed ${activity.lesson}`}
                    {activity.type === "achieved" &&
                      `Earned ${activity.achievement}`}
                    {activity.type === "started" &&
                      `Started ${activity.lesson}`}
                  </p>
                  <p className="text-gray-600 text-xs dark:text-gray-400">
                    {activity.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  </Tabs>
);

export default UserStats;
