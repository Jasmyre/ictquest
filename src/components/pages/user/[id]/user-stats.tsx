import { GraduationCap, Trophy } from "lucide-react";
import { CustomProgress } from "@/components/custom-progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import lessons from "@/db/lessons";
import type { DashboardData } from "@/server/schemas/dashboard";

type UserStatsProps = {
  user: DashboardData;
};

const UserStats = ({ user }: UserStatsProps) => (
  <Tabs className="w-full" defaultValue="progress">
    <TabsList className="mx-auto w-full max-w-md">
      <TabsTrigger className="flex-1 cursor-pointer" value="progress">
        Progress
      </TabsTrigger>
      <TabsTrigger className="flex-1 cursor-pointer" value="achievements">
        Achievements
      </TabsTrigger>
    </TabsList>

    <TabsContent className="mt-6" value="progress">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <GraduationCap aria-hidden="true" className="h-5 w-5" />
            Learning Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="mb-2 flex justify-between">
              <span className="font-medium text-foreground text-sm">
                Overall HTML Mastery
              </span>
              <span className="text-muted-foreground text-sm">
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
                  <span className="font-medium text-foreground text-sm">
                    {lesson.title}
                  </span>
                  <span className="text-muted-foreground text-sm">
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Trophy aria-hidden="true" className="h-5 w-5" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {user.achievements.map((achievement) => (
              <Card key={achievement.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-muted p-2">
                      <Trophy
                        aria-hidden="true"
                        className="h-6 w-6 text-primary"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {achievement.name}
                      </p>
                      <p className="text-muted-foreground text-sm">
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
  </Tabs>
);

export default UserStats;
