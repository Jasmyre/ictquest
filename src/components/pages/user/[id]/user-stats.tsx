import { Award, GraduationCap, Trophy } from "lucide-react";
import { CustomProgress } from "@/components/custom-progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import lessons from "@/db/lessons";
import type { api } from "@/trpc/server";

type UserStatsProps = {
  user: Awaited<ReturnType<typeof api.dashboard.getDashboardById>>["data"];
};

const TAB_TRIGGER_CLASS =
  "flex-1 cursor-pointer transition-colors duration-150 ease-out data-[state=active]:bg-primary data-[state=active]:text-primary-foreground";

const UserStats = ({ user }: UserStatsProps) => (
  <Tabs className="w-full" data-testid="user-stats" defaultValue="progress">
    <TabsList className="mx-auto w-full max-w-md">
      <TabsTrigger className={TAB_TRIGGER_CLASS} value="progress">
        Progress
      </TabsTrigger>
      <TabsTrigger className={TAB_TRIGGER_CLASS} value="achievements">
        Achievements
      </TabsTrigger>
    </TabsList>

    <TabsContent className="mt-6" value="progress">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap aria-hidden="true" className="size-5 text-primary" />
            Learning Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="stagger-enter space-y-6">
          <div>
            <div className="mb-2 flex justify-between">
              <span className="font-medium text-foreground text-sm">
                Overall HTML Mastery
              </span>
              <span className="text-muted-foreground text-sm tabular-nums">
                {user.totalProgress}%
              </span>
            </div>
            <CustomProgress finalValue={user.totalProgress} initialValue={0} />
          </div>

          {lessons.map((lesson) => {
            const progress = user.progressData.find(
              (item) => item.topic === lesson.slug
            );

            const completedSubtopics = progress?.subtopics.length ?? 0;
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
                  <span className="text-muted-foreground text-sm tabular-nums">
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
          <CardTitle className="flex items-center gap-2">
            <Trophy aria-hidden="true" className="size-5 text-primary" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          {user.achievements.length === 0 ? (
            <div className="rounded-xl border border-dashed px-6 py-16 text-center">
              <p className="font-medium text-foreground">No achievements yet</p>
              <p className="mt-1 text-muted-foreground text-sm">
                Unlocked achievements will appear here.
              </p>
            </div>
          ) : (
            <ul className="stagger-enter divide-y divide-border">
              {user.achievements.map((achievement) => (
                <li
                  className="flex items-center gap-4 py-4"
                  data-testid="achievement-row"
                  key={achievement.id}
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Award aria-hidden="true" className="size-5 text-primary" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium text-foreground text-sm">
                      {achievement.name}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {achievement.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  </Tabs>
);

export default UserStats;
