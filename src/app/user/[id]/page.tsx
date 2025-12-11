import type { ProgressData } from "@prisma/client";
import {
  Award,
  Book,
  Flag,
  GraduationCap,
  Sparkles,
  Star,
  Trophy,
  UserMinus,
  UserPlus,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserStats } from "@/data/user";
import lessons from "@/db/lessons";
import { CustomProgress } from "../../../components/CustomProgress";

const userData = {
  id: 1,
  name: "Sarah Wilson",
  username: "@sarahw",
  role: "Student",
  avatar: "/placeholder.svg?height=100&width=100",
  level: "Beginner",
  following: true,
  bio: "Passionate about web development and learning new technologies. Currently focusing on mastering HTML and CSS.",
  achievements: [
    {
      name: "Fast Learner",
      description: "Completed 5 lessons in one day",
      icon: Sparkles,
    },
    {
      name: "Perfect Score",
      description: "Achieved 100% in HTML Basics",
      icon: Star,
    },
    {
      name: "Consistent Learner",
      description: "Logged in for 7 days straight",
      icon: Trophy,
    },
  ],
  stats: {
    lessonsCompleted: 12,
    achievementsEarned: 5,
    daysStreak: 7,
    totalPoints: 1250,
  },
  progress: {
    "HTML Basics": 80,
    "CSS Fundamentals": 60,
    "JavaScript Essentials": 40,
    "Responsive Design": 20,
  },
  recentActivity: [
    { type: "completed", lesson: "HTML Tables", date: "2 days ago" },
    { type: "achieved", achievement: "Fast Learner", date: "3 days ago" },
    { type: "started", lesson: "CSS Grid", date: "4 days ago" },
  ],
};

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const isFollowing = userData.following;
  const { id } = await params;

  const user = await getUserStats(id!)!;
  console.log(user);

  const baseUrl = process.env.NEXTAUTH_URL;
  console.log(baseUrl);

  const res = await fetch(baseUrl + "/api/public/progress/" + id);

  console.log(baseUrl + "/api/public/progress/" + id);
  if (!res.ok) {
    const errorText = await res.text();
    console.error("Failed to fetch progress, got:", errorText);
    return;
  }

  const resData = await res.json();
  const data: ProgressData[] = resData;
  console.log(data);

  return (
    <div className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Card className="mb-8 overflow-hidden border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="h-32 bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-900/10" />
          <CardContent className="relative pt-0">
            <div className="-mt-12 md:-mt-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="flex flex-col items-start gap-4 md:flex-row md:items-end">
                <Avatar className="h-24 w-24 border-4 border-white md:h-32 md:w-32 dark:border-gray-800">
                  <AvatarImage
                    alt={user?.username ?? "unknown"}
                    src={user?.avatar ?? undefined}
                  />
                  <AvatarFallback className="text-2xl">
                    {user
                      ?.username!.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left md:text-left">
                  <h1 className="font-bold text-2xl text-gray-900 dark:text-white">
                    {user?.username}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    @{user?.id}
                  </p>
                  <br className="hidden max-sm:block" />
                  <div className="mt-2 flex items-center gap-2">
                    <Badge
                      className="border-gray-200 bg-gray-100 text-gray-600 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                      variant="outline"
                    >
                      Student
                    </Badge>
                    <Badge className="border-indigo-100 bg-indigo-100 text-indigo-700 dark:border-indigo-900/30 dark:bg-indigo-900/20 dark:text-indigo-300">
                      Level {user?.level}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 md:self-center">
                <Button
                  className="bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600"
                  variant={isFollowing ? "secondary" : "default"}
                >
                  {isFollowing ? (
                    <>
                      <UserMinus className="mr-2 h-4 w-4" />
                      Unfollow
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Follow
                    </>
                  )}
                </Button>
                <Button
                  className="border-gray-200 text-red-600 hover:bg-red-50 dark:border-gray-700 dark:text-red-400 dark:hover:bg-red-900/20"
                  variant="outline"
                >
                  <Flag className="h-4 w-4" />
                  <span className="sr-only">Report user</span>
                </Button>
              </div>
            </div>
            <p className="mt-6 text-gray-600 dark:text-gray-400">
              Bio not available
            </p>
          </CardContent>
        </Card>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
          {[
            {
              icon: Book,
              label: "Lessons Completed",
              value: user?.numberOfSubtopics,
            },
            {
              icon: Trophy,
              label: "Achievements",
              value: user?.numberOfAchievements,
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
        </div>

        <Tabs className="w-full" defaultValue="progress">
          <TabsList className="mx-auto w-full max-w-md border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
            <TabsTrigger
              className="flex-1 data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
              value="progress"
            >
              Progress
            </TabsTrigger>
            <TabsTrigger
              className="flex-1 data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
              value="achievements"
            >
              Achievements
            </TabsTrigger>
            <TabsTrigger
              className="flex-1 data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
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
                      {user?.averageProgress}%
                    </span>
                  </div>
                  <CustomProgress
                    finalValue={user?.averageProgress ?? 0}
                    initialValue={0}
                  />
                </div>

                {lessons.map((lesson) => {
                  const progress = data?.find(
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
                      <CustomProgress
                        finalValue={percentage}
                        initialValue={0}
                      />
                    </div>
                  );
                })}
                {/* {Object.entries(userData.progress).map(([course, progress]) => (
                  <div key={course}>
                    <div className="mb-2 flex justify-between">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {course}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {progress}%
                      </span>
                    </div>
                    <CustomProgress initialValue={0} finalValue={progress} />
                  </div>
                ))} */}
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
      </div>
    </div>
  );
}
