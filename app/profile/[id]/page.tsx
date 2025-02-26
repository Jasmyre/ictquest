import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

// Sample user data - In a real app, this would come from an API
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

export default function UserProfilePage() {
  const isFollowing = userData.following;

  return (
    <div className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <Card className="mb-8 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/10" />
          <CardContent className="relative pt-0">
            <div className="-mt-12 flex flex-col gap-6 md:-mt-16 md:flex-row md:items-end md:justify-between">
              <div className="flex flex-col items-center gap-4 md:flex-row md:items-end">
                <Avatar className="h-24 w-24 border-4 border-background md:h-32 md:w-32">
                  <AvatarImage src={userData.avatar} alt={userData.name} />
                  <AvatarFallback className="text-2xl">
                    {userData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center md:text-left">
                  <h1 className="text-2xl font-bold text-foreground">
                    {userData.name}
                  </h1>
                  <p className="text-muted-foreground">{userData.username}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="outline" className="bg-background">
                      {userData.role}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="border-primary/20 bg-primary/10 text-primary"
                    >
                      Level {userData.level}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 md:self-center">
                <Button variant={isFollowing ? "secondary" : "default"}>
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
                <Button variant="outline" className="text-destructive">
                  <Flag className="h-4 w-4" />
                  <span className="sr-only">Report user</span>
                </Button>
              </div>
            </div>
            <p className="mt-6 text-muted-foreground">{userData.bio}</p>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Book className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Lessons Completed
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {userData.stats.lessonsCompleted}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Achievements</p>
                  <p className="text-2xl font-bold text-foreground">
                    {userData.stats.achievementsEarned}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Day Streak</p>
                  <p className="text-2xl font-bold text-foreground">
                    {userData.stats.daysStreak}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Points</p>
                  <p className="text-2xl font-bold text-foreground">
                    {userData.stats.totalPoints}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="progress" className="w-full">
          <TabsList className="mx-auto w-full max-w-md">
            <TabsTrigger value="progress" className="flex-1">
              Progress
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex-1">
              Achievements
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex-1">
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="progress" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Learning Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(userData.progress).map(([course, progress]) => (
                  <div key={course}>
                    <div className="mb-2 flex justify-between">
                      <span className="text-sm font-medium text-foreground">
                        {course}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {progress}%
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {userData.achievements.map((achievement) => (
                    <Card key={achievement.name}>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                          <div className="rounded-lg bg-primary/10 p-2">
                            <achievement.icon className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">
                              {achievement.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
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

          <TabsContent value="activity" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userData.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="rounded-lg bg-primary/10 p-2">
                        {activity.type === "completed" && (
                          <Book className="h-4 w-4 text-primary" />
                        )}
                        {activity.type === "achieved" && (
                          <Trophy className="h-4 w-4 text-primary" />
                        )}
                        {activity.type === "started" && (
                          <Sparkles className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-foreground">
                          {activity.type === "completed" &&
                            `Completed ${activity.lesson}`}
                          {activity.type === "achieved" &&
                            `Earned ${activity.achievement}`}
                          {activity.type === "started" &&
                            `Started ${activity.lesson}`}
                        </p>
                        <p className="text-xs text-muted-foreground">
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
